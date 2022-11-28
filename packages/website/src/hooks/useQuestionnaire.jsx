import React from 'react';
import uuid from 'react-uuid';
import QuestionnaireContext from '../contexts/QuestionnaireContext';

export const END_QUESTIONNAIRE_VALUE = 'end_questionnaire';

export const QUESTION_TYPE_OPTIONS = [
  {
    value: 'TEXT',
    label: 'Text',
  },
  {
    value: 'NUMBER',
    label: 'Number',
  },
  {
    value: 'PREDEFINED_ANSWER',
    label: 'Predefined answer',
  },
];

export default function useQuestionnaire() {
  return React.useContext(QuestionnaireContext);
}

export function QuestionnaireProvider(props) {
  const { children } = props;
  const [questions, setQuestions] = React.useState([
    {
      id: uuid(),
      localIdentifier: 'Question 1',
      answers: [],
    },
  ]);

  const addQuestion = React.useCallback(() => {
    setQuestions((current) => [
      ...current,
      {
        id: uuid(),
        localIdentifier: `Question ${current.length + 1}`,
        answers: [],
      },
    ]);
  }, []);

  const removeQuestion = React.useCallback((questionId, unregister) => {
    // TODO: UNLINK ALL NEXT_QUESTION_ID IN QUESTIONS AND ANSWERS WHICH ARE LINKING TO THIS QUESTION
    setQuestions((current) => current.filter((q) => q.id !== questionId));
    unregister(`questions.${questionId}`);
  }, []);

  const shiftQuestion = React.useCallback((questionId, forward) => {
    setQuestions((current) => {
      const questionIndex = current.findIndex((q) => q.id === questionId);
      const question = { ...current[questionIndex] };
      current.splice(questionIndex, 1);
      current.splice(questionIndex + (forward ? 1 : -1), 0, question);
      // Return new array to prevent referential identity aliasing
      return [...current];
    });
  }, []);

  const setDefaultAnswers = React.useCallback((questionId) => {
    const newAnswers = [{ id: uuid() }, { id: uuid() }];
    setQuestions((current) => {
      const questionIndex = current.findIndex((q) => q.id === questionId);
      current[questionIndex].answers = newAnswers;
      // Return new array to prevent referential identity aliasing
      return [...current];
    });
    return newAnswers.map((answer) => answer.id);
  }, []);

  const addAnswer = React.useCallback((questionId) => {
    const answerId = uuid();
    setQuestions((current) => {
      const questionIndex = current.findIndex((q) => q.id === questionId);
      current[questionIndex].answers = [
        ...current[questionIndex].answers,
        { id: answerId },
      ];
      // Return new array to prevent referential identity aliasing
      return [...current];
    });
    return answerId;
  }, []);

  const removeAnswer = React.useCallback((questionId, answerId, unregister) => {
    setQuestions((current) => {
      const questionIndex = current.findIndex((q) => q.id === questionId);
      current[questionIndex].answers = current[questionIndex].answers.filter(
        (a) => a.id !== answerId
      );
      // Return new array to prevent referential identity aliasing
      return [...current];
    });
    unregister(`questions.${questionId}.answers.${answerId}`);
  }, []);

  const shiftAnswer = React.useCallback((questionId, answerId, forward) => {
    setQuestions((current) => {
      const questionIndex = current.findIndex((q) => q.id === questionId);
      const answerIndex = current[questionIndex].answers.findIndex(
        (a) => a.id === answerId
      );
      const answer = { ...current[questionIndex].answers[answerIndex] };
      current[questionIndex].answers.splice(answerIndex, 1);
      current[questionIndex].answers.splice(
        answerIndex + (forward ? 1 : -1),
        0,
        answer
      );
      // Return new array to prevent referential identity aliasing
      return [...current];
    });
  }, []);

  const removeAllAnswers = React.useCallback((questionId, unregister) => {
    setQuestions((current) => {
      const questionIndex = current.findIndex((q) => q.id === questionId);
      current[questionIndex].answers = [];
      // Return new array to prevent referential identity aliasing
      return [...current];
    });
    unregister(`questions.${questionId}.answers`);
  }, []);

  const updateQuestionLocalIdentifier = React.useCallback(
    (questionId, newLabel) => {
      setQuestions((current) => {
        const questionIndex = current.findIndex((q) => q.id === questionId);
        current[questionIndex].localIdentifier = newLabel;
        return [...current];
      });
    },
    []
  );

  function getQuestionTypeOptions(id) {
    return QUESTION_TYPE_OPTIONS.map((option) => ({
      ...option,
      key: `questions-${id}-type-option-${option.value}`,
    }));
  }

  function getEndQuestionnaireOption(questionId) {
    let key = 'endQuestionnaireOption';
    if (questionId) {
      key = `question-${questionId}-${key}`;
    }

    return {
      key,
      value: END_QUESTIONNAIRE_VALUE,
      label: 'End questionnaire',
    };
  }

  return (
    <QuestionnaireContext.Provider
      value={{
        questions,
        addQuestion,
        removeQuestion,
        shiftQuestion,
        addAnswer,
        removeAnswer,
        removeAllAnswers,
        setDefaultAnswers,
        shiftAnswer,
        getQuestionTypeOptions,
        getEndQuestionnaireOption,
        updateQuestionLocalIdentifier,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}
