import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function consolidateSubmissions(data) {
  return data.questionnaireSubmissions.map((submission) => {
    const matchingQuestionnaires = data.questionnaires.filter(
      (questionnaire) => questionnaire.id === submission.questionnaireId
    );
    let answers = submission.participantAnswers;

    // Attempt to match questionnaire to the submission to resolve content for each answer
    if (matchingQuestionnaires.length === 1) {
      const questionnaire = matchingQuestionnaires[0];
      answers = submission.participantAnswers.map((answer) => {
        const matchingQuestions = questionnaire.questions.filter(
          (question) => question.id === answer.questionId
        );
        let answerContent = answer.content;

        // Only process answers which define questionAnswerId and have a matching question in questionnaire
        if (
          answer.questionAnswerId !== null &&
          matchingQuestions.length === 1
        ) {
          const matchingQuestionAnswers =
            matchingQuestions[0].questionAnswers.filter(
              (questionAnswer) => questionAnswer.id === answer.questionAnswerId
            );

          // Only resolve the answer content if there is a matching questionAnswer
          if (matchingQuestionAnswers.length === 1) {
            answerContent = matchingQuestionAnswers[0].content;
          }
        }

        return {
          ...answer,
          content: answerContent,
        };
      });
    }

    // Strip unnecessary answer properties.
    answers = answers.map((answer) => ({
      questionId: answer.questionId,
      questionAnswerId: answer.questionAnswerId,
      content: answer.content,
    }));

    return {
      id: submission.id,
      submittedAt: submission.createdAt,
      questionnaireId: submission.questionnaireId,
      participantId: submission.participantId,
      answers,
      notificationSentAt:
        submission.notification && submission.notification.sentAt
          ? submission.notification.sentAt
          : null,
    };
  });
}

function tabulariseSubmissions(submissions) {
  const composedAnswers = submissions.map((submission) =>
    submission.answers.map((answer) => ({
      submissionId: submission.id,
      notificationSentAt: submission.notificationSentAt,
      submittedAt: submission.submittedAt,
      participantId: submission.participantId,
      questionnaireId: submission.questionnaireId,
      questionId: answer.questionId,
      answerId: answer.questionAnswerId,
      answer: answer.content,
    }))
  );
  const table = composedAnswers.flat();

  const header =
    'submissionId,notificationSentAt,submittedAt,participantId,questionnaireId,questionId,answerId,answer';
  const text = table.map((a) => {
    const cleanedAnswer = a.answer.replace('"', "''");
    return `${a.submissionId},${a.notificationSentAt},${a.submittedAt},${a.participantId},${a.questionnaireId},${a.questionId},${a.answerId},"${cleanedAnswer}"`;
  });

  return [header, ...text].join('\n');
}

function tabulariseParticipants(participants) {
  const composedParticipants = participants.map((participant) => ({
    participantId: participant.id,
    givenName: participant.user.givenName || '',
    familyName: participant.user.familyName || '',
    email: participant.user.email || '',
    startDate: participant.startDate,
    endDate: participant.endDate,
    invitationSentAt: participant.invitationSentAt,
    invitationAcceptedAt: participant.invitationAcceptedAt,
    invitationRejectedAt: participant.invitationRejectedAt,
  }));

  const header =
    'participantId,givenName,familyName,email,startDate,endDate,invitationSentAt,invitationAcceptedAt,invitationRejectedAt';
  const text = composedParticipants.map((p) => {
    const cleanedGivenName = p.givenName.replace('"', "''");
    const cleanedFamilyName = p.familyName.replace('"', "''");
    const cleanedEmail = p.email.replace('"', "''");
    return `${p.participantId},"${cleanedGivenName}","${cleanedFamilyName}","${cleanedEmail}",${p.startDate},${p.endDate},${p.invitationSentAt},${p.invitationAcceptedAt},${p.invitationRejectedAt}`;
  });

  return [header, ...text].join('\n');
}

function tabulariseQuestions(questionnaires) {
  const composedAnswers = questionnaires.map((questionnaire) => {
    const questions = questionnaire.questions.map((question) => {
      const answers = question.questionAnswers.map((questionAnswer) => ({
        answerId: questionAnswer.id,
        answerContent: questionAnswer.content,
        nextQuestionId: questionAnswer.nextQuestionId,
      }));

      if (answers.length === 0) {
        answers.push({
          answerId: null,
          answerContent: null,
          nextQuestionId: null,
        });
      }

      return answers.map((answer) => ({
        questionId: question.id,
        questionPrompt: question.prompt,
        questionType: question.type,
        questionPlaceholder: question.placeholder,
        ...answer,
        nextQuestionId:
          answer.nextQuestionId !== null
            ? answer.nextQuestionId
            : question.nextQuestionId,
      }));
    });

    return questions.flat().map((question) => ({
      questionnaireId: questionnaire.id,
      questionnaireName: questionnaire.name,
      questionIsFirst: questionnaire.rootQuestionId === question.id,
      ...question,
    }));
  });

  const table = composedAnswers.flat();

  const header =
    'questionnaireId,questionnaireName,questionIsFirst,questionId,questionPrompt,questionType,questionPlaceholder,answerId,answerContent,nextQuestionId';
  const text = table.map((a) => {
    const cleanedQuestionnaireName = a.questionnaireName.replace('"', "''");
    const cleanedQuestionPrompt = a.questionPrompt.replace('"', "''");
    const cleanedQuestionPlaceholder =
      typeof a.questionPlaceholder === 'string'
        ? a.questionPlaceholder.replace('"', "''")
        : a.questionPlaceholder;
    const cleanedAnswerContent =
      typeof a.answerContent === 'string'
        ? a.answerContent.replace('"', "''")
        : a.answerContent;
    return `${a.questionnaireId},"${cleanedQuestionnaireName}",${a.questionIsFirst},${a.questionId},"${cleanedQuestionPrompt}",${a.questionType},"${cleanedQuestionPlaceholder}",${a.answerId},"${cleanedAnswerContent}",${a.nextQuestionId}`;
  });

  return [header, ...text].join('\n');
}

function getFilename() {
  return `${new Date().toISOString().replace(':', '-').replace('.', '')}.zip`;
}

export async function exportToCsv(data) {
  const zip = new JSZip();
  const consolidatedSubmissions = consolidateSubmissions(data);
  const tabularisedSubmissions = tabulariseSubmissions(consolidatedSubmissions);
  zip.file('questionnaire_submissions.csv', tabularisedSubmissions);
  const tabularisedQuestions = tabulariseQuestions(data.questionnaires);
  zip.file('questionnaires.csv', tabularisedQuestions);
  zip.file('info.txt', `Data dump generated on ${new Date().toISOString()}.`);

  if (Array.isArray(data.participants)) {
    const tabularisedParticipants = tabulariseParticipants(data.participants);
    zip.file('participants.csv', tabularisedParticipants);
  }

  return zip.generateAsync({ type: 'blob' }).then((blob) => {
    // eslint-disable-next-line no-undef
    saveAs(blob, getFilename());
  });
}

export async function exportToJson(data) {
  const zip = new JSZip();
  const consolidatedSubmissions = consolidateSubmissions(data);
  zip.file(
    'questionnaire_submissions.json',
    JSON.stringify(consolidatedSubmissions)
  );
  zip.file('questionnaires.json', JSON.stringify(data.questionnaires));
  zip.file('info.txt', `Data dump generated on ${new Date().toISOString()}.`);

  if (Array.isArray(data.participants)) {
    zip.file('participants.json', JSON.stringify(data.participants));
  }
  return zip.generateAsync({ type: 'blob' }).then((blob) => {
    // eslint-disable-next-line no-undef
    saveAs(blob, getFilename());
  });
}
