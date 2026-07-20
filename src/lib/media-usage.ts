import { prisma } from './db';

/**
 * Automatically tracks and synchronizes where media files are being used.
 *
 * @param entity The name of the referencing entity (e.g., "Product", "Dealer", "User", "CMS", "Post")
 * @param entityId The ID of the referencing entity
 * @param urls The list of media URLs used in the entity fields
 * @param fieldName Optional field name tag (e.g., "thumbnail", "logo", "coverImage")
 */
export async function syncMediaUsages(
  entity: string,
  entityId: string,
  urls: (string | null | undefined)[],
  fieldName?: string
) {
  try {
    // 1. Filter out null/undefined/empty and extract filenames from /uploads/ path
    const validUrls = urls.filter((u): u is string => typeof u === 'string' && u.includes('/uploads/'));
    
    const filenames = validUrls.map(url => {
      const parts = url.split('/');
      return parts[parts.length - 1];
    });

    if (filenames.length === 0) {
      // Clear all usages for this entity/field combination since none are referenced
      await prisma.mediaUsage.deleteMany({
        where: {
          entity,
          entityId,
          ...(fieldName && { fieldName })
        }
      });
      return;
    }

    // 2. Fetch the corresponding Media records
    const matchingMedia = await prisma.media.findMany({
      where: {
        filename: { in: filenames }
      },
      select: { id: true, filename: true }
    });

    const activeMediaIds = matchingMedia.map(m => m.id);

    // 3. Clear outdated usages
    await prisma.mediaUsage.deleteMany({
      where: {
        entity,
        entityId,
        ...(fieldName && { fieldName }),
        mediaId: { notIn: activeMediaIds }
      }
    });

    // 4. Link active usages via upsert transactions
    for (const mediaId of activeMediaIds) {
      await prisma.mediaUsage.upsert({
        where: {
          mediaId_entity_entityId_fieldName: {
            mediaId,
            entity,
            entityId,
            fieldName: fieldName || 'general'
          }
        },
        update: {},
        create: {
          mediaId,
          entity,
          entityId,
          fieldName: fieldName || 'general'
        }
      });
    }
  } catch (error) {
    console.error(`[syncMediaUsages] Error syncing for ${entity} #${entityId}:`, error);
  }
}
