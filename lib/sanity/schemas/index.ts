// Schema types for Summit Chronicles CMS
import { blogPost } from './blogPost';
import { trainingEntry } from './trainingEntry';
import { expeditionUpdate } from './expeditionUpdate';
import { expedition } from './expedition';
import { mediaAsset } from './mediaAsset';
import { author } from './author';
import { category } from './category';
import { personalStory } from './personalStory';
import { achievement } from './achievement';
import { gear } from './gear';
import { sponsor } from './sponsor';
import { weatherSummary } from './weatherSummary';

export const schemaTypes = [
  // Content Types
  blogPost,
  expedition,
  trainingEntry,
  expeditionUpdate,
  personalStory,
  achievement,
  weatherSummary,

  // Media & Assets
  mediaAsset,
  gear,

  // Taxonomy
  author,
  category,
  sponsor,
];
