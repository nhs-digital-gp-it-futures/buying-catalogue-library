export const formatErrors = ({ manifest, errors }) => errors.reduce((acc, error) => {
  const errorMessageLocator = `${error.field[0].toLowerCase()}${error.field.slice(1)}`;
  if (acc[errorMessageLocator]) acc[errorMessageLocator].push(manifest.errorMessages[error.id]);
  else acc[errorMessageLocator] = [manifest.errorMessages[error.id]];
  return acc;
}, {});

export const addErrorsAndDataToManifest = ({ manifest, errors, data }) => ({
  ...manifest,
  questions: manifest.questions.map((question) => {
    const modifiedQuestion = { ...question };
    if (errors[question.id]) modifiedQuestion.error = { message: errors[question.id].join(', ') };
    if (data && data[question.id]) modifiedQuestion.data = data[question.id];
    return modifiedQuestion;
  }),
});

export const addErrorsAndDataToManifestKeyValuePair = ({ manifest, errors, data }) => ({
  ...manifest,
  questions: Object.entries(manifest.questions).map((question) => {
    const modifiedQuestion = { ...question[1] };
    if (errors[question[1].id]) modifiedQuestion.error = { message: errors[question[1].id].join(', ') };
    if (data && data[question[1].id]) modifiedQuestion.data = data[question[1].id];
    return modifiedQuestion;
  }),
});

export const formatAllErrors = questionsWithErrors => questionsWithErrors.reduce(
  (acc, question) => {
    if (question.error) {
      question.error.message.split(', ').forEach((errorString) => {
        acc.push({
          text: errorString,
          href: `#${question.id}`,
        });
      });
    }
    return acc;
  }, [],
);
