/**
 * Shared page transition animations.
 *
 * Forward navigation (e.g. Home → About):
 *   - Old page fades out and slides up slightly
 *   - New page fades in and slides up from below
 *
 * Backward navigation (e.g. About → Home):
 *   - Old page fades out and slides down slightly
 *   - New page fades in and slides down from above
 */
export const pageTransition = {
  forwards: {
    old: {
      name: 'fadeOutUp',
      duration: '0.2s',
      easing: 'ease-in',
      fillMode: 'forwards',
    },
    new: {
      name: 'fadeInUp',
      duration: '0.3s',
      easing: 'ease-out',
      fillMode: 'backwards',
      delay: '0.1s',
    },
  },
  backwards: {
    old: {
      name: 'fadeOutDown',
      duration: '0.2s',
      easing: 'ease-in',
      fillMode: 'forwards',
    },
    new: {
      name: 'fadeInDown',
      duration: '0.3s',
      easing: 'ease-out',
      fillMode: 'backwards',
      delay: '0.1s',
    },
  },
}
