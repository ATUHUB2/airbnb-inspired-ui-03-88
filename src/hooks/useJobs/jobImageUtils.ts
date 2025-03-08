import { Job } from "@/types/job";

// Vérifie si une URL est au format base64
const isBase64Image = (url: string): boolean => {
  return url && typeof url === 'string' && url.startsWith('data:image/');
};

// Vérifie si une URL est au format http/https
const isValidHttpUrl = (url: string): boolean => {
  try {
    return url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
  } catch {
    return false;
  }
};

// Vérifie si une URL est au format blob
const isBlobUrl = (url: string): boolean => {
  return url && typeof url === 'string' && url.startsWith('blob:');
};

// Convert blob URL to base64 - NEW FUNCTION
export const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
  if (!blobUrl || !isBlobUrl(blobUrl)) {
    return blobUrl; // Return as is if not a blob URL
  }
  
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => {
        console.error('Error converting blob to base64');
        reject(new Error('Failed to convert blob to base64'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching blob URL:', error);
    return "https://source.unsplash.com/random/800x600/?work"; // Fallback image
  }
};

export const processStoredImages = (job: Job): Job => {
  if (!job.id) return job;
  
  try {
    // Vérifier si l'image principale existe déjà et est valide
    const hasValidMainImage = job.image && (isBase64Image(job.image) || isValidHttpUrl(job.image));
    
    // Vérifier si les images supplémentaires existent déjà et sont valides
    const hasValidImages = job.images && 
                          Array.isArray(job.images) && 
                          job.images.length > 0 && 
                          job.images.every(img => isBase64Image(img) || isValidHttpUrl(img));
    
    // Si l'offre a déjà des images valides, ne rien faire
    if (hasValidMainImage && hasValidImages) {
      console.log(`L'offre ${job.id} a déjà des images valides, aucune récupération nécessaire`);
      return job;
    }
    
    // Récupérer les images depuis localStorage
    const savedImagesKey = `job_images_${job.id}`;
    const savedImagesStr = localStorage.getItem(savedImagesKey);
    
    const latestImagesStr = localStorage.getItem('job_images_latest');
    
    // Vérifier plusieurs sources d'images
    if (savedImagesStr) {
      try {
        const savedImages = JSON.parse(savedImagesStr);
        if (Array.isArray(savedImages) && savedImages.length > 0) {
          console.log(`Images récupérées depuis localStorage pour l'offre ${job.id}`);
          job.images = savedImages.filter(img => isBase64Image(img) || isValidHttpUrl(img));
          if (!job.image && job.images.length > 0) {
            job.image = job.images[0];
          }
        }
      } catch (e) {
        console.error(`Erreur de parsing pour ${savedImagesKey}:`, e);
      }
    } else if (latestImagesStr && !hasValidImages) {
      try {
        const latestImages = JSON.parse(latestImagesStr);
        if (Array.isArray(latestImages) && latestImages.length > 0) {
          console.log(`Images récupérées depuis 'latest' pour l'offre ${job.id}`);
          job.images = latestImages.filter(img => isBase64Image(img) || isValidHttpUrl(img));
          if (!job.image && job.images.length > 0) {
            job.image = job.images[0];
          }
        }
      } catch (e) {
        console.error(`Erreur de parsing pour job_images_latest:`, e);
      }
    }
    
    // Récupérer l'image principale si nécessaire
    if (!job.image || !isValidHttpUrl(job.image)) {
      const featuredImageKey = `job_featured_image_${job.id}`;
      const featuredImage = localStorage.getItem(featuredImageKey);
      const latestFeaturedImage = localStorage.getItem('job_featured_image_latest');
      
      if (featuredImage) {
        try {
          // Essayer de nettoyer l'image
          if (featuredImage.startsWith('"') && featuredImage.endsWith('"')) {
            job.image = featuredImage.substring(1, featuredImage.length - 1);
          } else {
            job.image = featuredImage;
          }
          console.log(`Image principale récupérée pour l'offre ${job.id}:`, job.image);
        } catch (e) {
          console.error(`Erreur lors du traitement de l'image principale pour ${job.id}:`, e);
        }
      } else if (latestFeaturedImage && !hasValidMainImage) {
        try {
          // Essayer de nettoyer l'image
          if (latestFeaturedImage.startsWith('"') && latestFeaturedImage.endsWith('"')) {
            job.image = latestFeaturedImage.substring(1, latestFeaturedImage.length - 1);
          } else {
            job.image = latestFeaturedImage;
          }
          console.log(`Image principale récupérée depuis 'latest' pour l'offre ${job.id}:`, job.image);
        } catch (e) {
          console.error(`Erreur lors du traitement de l'image principale depuis 'latest' pour ${job.id}:`, e);
        }
      } else if (job.images && job.images.length > 0) {
        job.image = job.images[0];
        console.log(`Image principale définie à partir des images pour l'offre ${job.id}:`, job.image);
      }
    }
    
    // S'assurer que nous n'avons pas de blob URLs (qui ne persisteront pas)
    if (job.image && isBlobUrl(job.image)) {
      console.warn(`Image principale en format blob trouvée pour l'offre ${job.id}, remplacement par défaut`);
      job.image = "https://source.unsplash.com/random/800x600/?work";
    }
    
    if (job.images) {
      const hasBlobs = job.images.some(img => isBlobUrl(img));
      if (hasBlobs) {
        console.warn(`Images blob trouvées pour l'offre ${job.id}, filtrage`);
        job.images = job.images.filter(img => !isBlobUrl(img));
        if (job.images.length === 0) {
          job.images = ["https://source.unsplash.com/random/800x600/?work"];
        }
      }
    }
    
  } catch (error) {
    console.error(`Erreur lors de la récupération des images de l'offre ${job.id}:`, error);
  }
  
  return job;
};

export const saveJobImages = (jobId: string, images: string[]): void => {
  if (!jobId || !images || images.length === 0) return;
  
  try {
    const key = `job_images_${jobId}`;
    
    // Filtrer les images valides (base64 ou http/https)
    const validImages = images.filter(img => 
      img && 
      typeof img === 'string' && 
      (img.startsWith('data:image/') || 
       img.startsWith('http') || 
       img.startsWith('https'))
    );
    
    if (validImages.length > 0) {
      localStorage.setItem(key, JSON.stringify(validImages));
      console.log(`Images valides sauvegardées pour l'offre ${jobId}:`, validImages.length);
      
      // Sauvegarder également l'image principale
      if (validImages[0]) {
        localStorage.setItem(`job_featured_image_${jobId}`, validImages[0]);
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des images pour l'offre ${jobId}:`, error);
  }
};

export const clearJobImages = (jobId: string): void => {
  if (!jobId) return;
  
  try {
    const key = `job_images_${jobId}`;
    localStorage.removeItem(key);
    localStorage.removeItem(`job_featured_image_${jobId}`);
    console.log(`Images supprimées pour l'offre ${jobId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression des images pour l'offre ${jobId}:`, error);
  }
};

export const purgeAllJobImages = (): void => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('job_images_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`${keysToRemove.length} entrées d'images d'offres supprimées du localStorage`);
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les images:', error);
  }
};
