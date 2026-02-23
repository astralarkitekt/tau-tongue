/**
 * Jung-Tongue — a Jungian symbolic system for the Tau-Tongue pipeline.
 *
 * 12 archetypes mapped to digital roots 1-9, 11, 12.
 * Typal numbers [11, 12] halt digital-root reduction.
 * Uses the default 256-symbol operator algebra (no custom symbolMap).
 *
 * @see TauTongueConfig
 */

// SceneFunction is re-exported from the library index
import { SceneFunction } from '../dist/index.js';

/** @type {import('../dist/index.js').TauTongueConfig} */
export const JUNG_CONFIG = {
  archetypeMap: {
    1:  'The Hero',
    2:  'The Shadow',
    3:  'The Anima',
    4:  'The Animus',
    5:  'The Trickster',
    6:  'The Mother',
    7:  'The Sage',
    8:  'The Persona',
    9:  'The Self',
    11: 'The Syzygy',
    12: 'The Individuation',
  },

  archetypeDescriptions: {
    'The Hero':
      'The conscious ego embarking on the journey — courage, will, and the call to transformation.',
    'The Shadow':
      'The repressed darkness — what is denied rises to be integrated or destroys from within.',
    'The Anima':
      'The feminine within — intuition, feeling, and the bridge to the unconscious.',
    'The Animus':
      'The masculine within — logos, judgement, and the structuring principle of the psyche.',
    'The Trickster':
      'The boundary-crosser — chaos, humour, and the dissolution of rigid forms.',
    'The Mother':
      'The nurturing ground — origin, protection, and the embrace that both holds and devours.',
    'The Sage':
      'The seeker of meaning — wisdom, contemplation, and the light of understanding.',
    'The Persona':
      'The social mask — the face worn for the world, useful yet dangerously mistaken for self.',
    'The Self':
      'The totality of the psyche — the union of opposites; the mandala at the centre.',
    'The Syzygy':
      'The divine pair — the sacred marriage of Anima and Animus, reconciling all polarities.',
    'The Individuation':
      'The opus of becoming — the lifelong process of integrating the unconscious into wholeness.',
  },

  resonanceMap: {
    1:  'QUEST',
    2:  'REPRESSION',
    3:  'INTUITION',
    4:  'LOGOS',
    5:  'LIMINALITY',
    6:  'CONTAINMENT',
    7:  'GNOSIS',
    8:  'ADAPTATION',
    9:  'MANDALA',
    11: 'CONIUNCTIO',
    12: 'OPUS',
  },

  resonanceDescriptions: {
    'QUEST':
      'The call to adventure; the ego awakens and sets forth into the unknown.',
    'REPRESSION':
      'That which is pushed beneath the threshold; the source of complexes and projections.',
    'INTUITION':
      'Knowledge arising unbidden from the depths; the whisper of the anima.',
    'LOGOS':
      'Discriminating thought; the ordering principle that carves meaning from chaos.',
    'LIMINALITY':
      'The threshold between states; neither here nor there, where transformation occurs.',
    'CONTAINMENT':
      'The temenos — the sacred vessel that holds the psyche during transformation.',
    'GNOSIS':
      'Direct knowledge of the numinous; insight earned through inner descent.',
    'ADAPTATION':
      'The persona\'s function — fitting self to world without losing the inner truth.',
    'MANDALA':
      'The symbol of wholeness; the circle that reconciles all fragments into unity.',
    'CONIUNCTIO':
      'The alchemical wedding; the union of opposites that births the philosopher\'s stone.',
    'OPUS':
      'The great work of individuation; the lifelong labour of becoming who you truly are.',
  },

  archetypeFunctionMap: {
    1:  SceneFunction.ACTION,       // Hero — acts
    2:  SceneFunction.FLASHBACK,    // Shadow — erupts from the past
    3:  SceneFunction.REFLECTION,   // Anima — reflects
    4:  SceneFunction.EXPOSITION,   // Animus — explains
    5:  SceneFunction.TRANSITION,   // Trickster — shifts the scene
    6:  SceneFunction.DIALOGUE,     // Mother — speaks, soothes
    7:  SceneFunction.REFLECTION,   // Sage — contemplates
    8:  SceneFunction.CALLBACK,     // Persona — echoes what was shown
    9:  SceneFunction.EXPOSITION,   // Self — reveals the whole
    11: SceneFunction.DIALOGUE,     // Syzygy — two voices merge
    12: SceneFunction.TRANSITION,   // Individuation — passage to new state
  },

  // [11, 12] — master numbers that halt digital-root reduction
  typalNumbers: [11, 12],
};
