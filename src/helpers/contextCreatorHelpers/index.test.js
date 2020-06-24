import {
  formatErrors, formatAllErrors, addErrorsAndDataToManifest, addErrorsAndDataToManifestKeyValuePair,
} from '.';

const manifest = {
  title: 'Title of page',
  questions: [{
    id: 'question1',
    mainAdvice: 'question 1 main advice',
  }, {
    id: 'question2',
    mainAdvice: 'question 1 main advice',
  }, {
    id: 'question3',
    mainAdvice: 'question 3 main advice',
  }],
  errorMessages: {
    Field1Required: 'Field 1 is required',
    Field1TooLong: 'Field 1 is too long',
    Field2Required: 'Field 2 is required',
  },
};

const errors = [
  { field: 'question1', id: 'Field1Required' },
  { field: 'question1', id: 'Field1TooLong' },
  { field: 'question2', id: 'Field2Required' },
];

describe('contextCreatorErrorHelper', () => {
  describe('formatErrors', () => {
    it('should create error object with field as key and array of messages for one error', () => {
      const formattedErrors = formatErrors({ manifest, errors: [errors[0]] });
      expect(formattedErrors).toEqual({ question1: ['Field 1 is required'] });
    });

    it('should create error object with field as key and array of messages for multiple errors', () => {
      const formattedErrors = formatErrors({ manifest, errors });
      expect(formattedErrors.question1).toEqual(
        ['Field 1 is required', 'Field 1 is too long'],
      );
      expect(formattedErrors.question2).toEqual(['Field 2 is required']);
    });
  });

  describe('addErrorsAndDataToManifest', () => {
    const formattedErrors = formatErrors({ manifest, errors });
    it('should return the contents of the manifest', () => {
      const manifestWithErrors = addErrorsAndDataToManifest({ manifest, errors: formattedErrors });
      expect(manifestWithErrors.title).toEqual(manifest.title);
      expect(manifestWithErrors.questions.length).toEqual(manifest.questions.length);
      manifestWithErrors.questions.forEach((question, i) => {
        expect(question.id).toEqual(manifest.questions[i].id);
        expect(question.text).toEqual(manifest.questions[i].text);
      });
    });

    it('should add the errors to the correct questions', () => {
      const manifestWithErrors = addErrorsAndDataToManifest({ manifest, errors: formattedErrors });
      expect(manifestWithErrors.questions[0].error).toEqual({ message: 'Field 1 is required, Field 1 is too long' });
      expect(manifestWithErrors.questions[1].error).toEqual({ message: 'Field 2 is required' });
      expect(manifestWithErrors.questions[2].error).toEqual(undefined);
    });

    it('should add the data to the correct questions', () => {
      const data = {
        question1: 'Data for q1',
        question3: 'Data for q3',
      };
      const manifestWithErrors = addErrorsAndDataToManifest({
        manifest, errors: formattedErrors, data,
      });
      expect(manifestWithErrors.questions[0].data).toEqual('Data for q1');
      expect(manifestWithErrors.questions[1].data).toEqual(undefined);
      expect(manifestWithErrors.questions[2].data).toEqual('Data for q3');
    });
  });

  describe('addErrorsAndDataToManifestKeyValuePair', () => {
    const manifestKeyValueQuestions = {
      title: 'Title of page',
      questions: {
        question1: {
          id: 'question1',
          mainAdvice: 'question 1 main advice',
        },
        question2: {
          id: 'question2',
          mainAdvice: 'question 1 main advice',
        },
        question3: {
          id: 'question3',
          mainAdvice: 'question 3 main advice',
        },
      },
      errorMessages: {
        Field1Required: 'Field 1 is required',
        Field1TooLong: 'Field 1 is too long',
        Field2Required: 'Field 2 is required',
      },
    };
    const formattedErrors = formatErrors({ manifest: manifestKeyValueQuestions, errors });
    it('should return the contents of the manifest', () => {
      const manifestWithErrors = addErrorsAndDataToManifestKeyValuePair(
        { manifest: manifestKeyValueQuestions, errors: formattedErrors },
      );
      expect(manifestWithErrors.title).toEqual(manifestKeyValueQuestions.title);

      expect(manifestWithErrors.questions[0].id)
        .toEqual(manifestKeyValueQuestions.questions.question1.id);
      expect(manifestWithErrors.questions[0].id.text)
        .toEqual(manifestKeyValueQuestions.questions.question1.text);

      expect(manifestWithErrors.questions[1].id)
        .toEqual(manifestKeyValueQuestions.questions.question2.id);
      expect(manifestWithErrors.questions[1].id.text)
        .toEqual(manifestKeyValueQuestions.questions.question2.text);

      expect(manifestWithErrors.questions[2].id)
        .toEqual(manifestKeyValueQuestions.questions.question3.id);
      expect(manifestWithErrors.questions[2].id.text)
        .toEqual(manifestKeyValueQuestions.questions.question3.text);
    });

    it('should add the errors to the correct questions', () => {
      const manifestWithErrors = addErrorsAndDataToManifestKeyValuePair(
        { manifest: manifestKeyValueQuestions, errors: formattedErrors },
      );
      expect(manifestWithErrors.questions[0].error).toEqual({ message: 'Field 1 is required, Field 1 is too long' });
      expect(manifestWithErrors.questions[1].error).toEqual({ message: 'Field 2 is required' });
      expect(manifestWithErrors.questions[2].error).toEqual(undefined);
    });

    it('should add the data to the correct questions', () => {
      const data = {
        question1: 'Data for q1',
        question3: 'Data for q3',
      };
      const manifestWithErrors = addErrorsAndDataToManifestKeyValuePair({
        manifest: manifestKeyValueQuestions, errors: formattedErrors, data,
      });
      expect(manifestWithErrors.questions[0].data).toEqual('Data for q1');
      expect(manifestWithErrors.questions[1].data).toEqual(undefined);
      expect(manifestWithErrors.questions[2].data).toEqual('Data for q3');
    });
  });

  describe('formatAllErrors', () => {
    const formattedErrors = formatErrors({ manifest, errors });
    const manifestWithErrors = addErrorsAndDataToManifest({ manifest, errors: formattedErrors });
    it('should return an array of error objects in the correct format', () => {
      const allErrors = formatAllErrors(manifestWithErrors.questions);
      expect(allErrors[0].href).toEqual('#question1');
      expect(allErrors[0].text).toEqual('Field 1 is required');
      expect(allErrors[1].href).toEqual('#question1');
      expect(allErrors[1].text).toEqual('Field 1 is too long');
      expect(allErrors[2].href).toEqual('#question2');
      expect(allErrors[2].text).toEqual('Field 2 is required');
    });
  });
});
