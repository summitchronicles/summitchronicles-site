import type { StructureResolver } from 'sanity/structure';

const primaryDocumentTypes = new Set([
  'blogPost',
  'expeditionUpdate',
  'trainingEntry',
]);

export const summitChroniclesStructure: StructureResolver = (S) =>
  S.list()
    .title('Summit Chronicles')
    .items([
      S.documentTypeListItem('blogPost').title('Stories and Thoughts'),
      S.documentTypeListItem('expeditionUpdate').title('Expedition Updates'),
      S.documentTypeListItem('trainingEntry').title('Training Updates'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !primaryDocumentTypes.has(item.getId() ?? '')
      ),
    ]);
