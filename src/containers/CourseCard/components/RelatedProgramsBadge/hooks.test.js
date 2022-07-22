import { useIntl } from '@edx/frontend-platform/i18n';

import { MockUseState } from 'testUtils';
import { hooks as appHooks } from 'data/redux';

import * as hooks from './hooks';
import messages from './messages';

jest.mock('data/redux', () => ({
  hooks: {
    useCardRelatedProgramsData: jest.fn(),
  },
}));

const courseNumber = 'my-test-course-number';

const state = new MockUseState(hooks);
const numPrograms = 27;

const { formatMessage } = useIntl();

describe('RelatedProgramsBadge hooks', () => {
  let out;
  describe('state values', () => {
    state.testGetter(state.keys.isOpen);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('useRelatedProgramsBadgeData', () => {
    beforeEach(() => {
      state.mock();
      appHooks.useCardRelatedProgramsData.mockReturnValueOnce({
        length: numPrograms,
      });
      out = hooks.useRelatedProgramsBadgeData({ courseNumber });
    });
    afterEach(state.restore);

    test('openModal sets isOpen to true as useCallback', () => {
      const { cb, prereqs } = out.openModal.useCallback;
      expect(prereqs).toEqual([state.setState.isOpen]);
      cb();
      expect(state.setState.isOpen).toHaveBeenCalledWith(true);
    });

    test('closeModal sets isOpen to false as useCallback', () => {
      const { cb, prereqs } = out.closeModal.useCallback;
      expect(prereqs).toEqual([state.setState.isOpen]);
      cb();
      expect(state.setState.isOpen).toHaveBeenCalledWith(false);
    });

    test('isOpen returns state value for isOpen', () => {
      expect(out.isOpen).toEqual(state.stateVals.isOpen);
    });

    test('forwards numPrograms from relatedPrograms.length for the courseNumber', () => {
      expect(out.numPrograms).toEqual(numPrograms);
    });
    test('returns empty programsMessage if no programs', () => {
      appHooks.useCardRelatedProgramsData.mockReturnValueOnce({ length: 0 });
      out = hooks.useRelatedProgramsBadgeData({ courseNumber });
      expect(out.programsMessage).toEqual('');
    });
    test('returns badgeLabelSingular programsMessage if 1 programs', () => {
      appHooks.useCardRelatedProgramsData.mockReturnValueOnce({ length: 1 });
      out = hooks.useRelatedProgramsBadgeData({ courseNumber });
      expect(out.programsMessage).toEqual(formatMessage(
        messages.badgeLabelSingular,
        { numPrograms: 1 },
      ));
    });
    test('returns badgeLabelSingular programsMessage if multiple programs', () => {
      expect(out.programsMessage).toEqual(formatMessage(
        messages.badgeLabelPlural,
        { numPrograms },
      ));
    });
  });
});
