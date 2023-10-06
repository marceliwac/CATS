import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HelpInstructions.module.scss';
import HelpSection from './HelpSection/HelpSection';
import HelpSectionImage from './HelpSectionImage/HelpSectionImage';
import screenshot_form from '../../../../assets/images/screenshots/screenshot_form.png';
import screenshot_end_interval from '../../../../assets/images/screenshots/screenshot_end_interval.png';
import screenshot_instructions from '../../../../assets/images/screenshots/screenshot_instructions.png';
import screenshot_label_list from '../../../../assets/images/screenshots/screenshot_label_list.png';
import screenshot_mark_as_labelled from '../../../../assets/images/screenshots/screenshot_mark_as_labelled.png';
import screenshot_navbar from '../../../../assets/images/screenshots/screenshot_navbar.png';
import screenshot_navigating_to_stay_assignment from '../../../../assets/images/screenshots/screenshot_navigating_to_stay_assignment.png';
import screenshot_patient_data from '../../../../assets/images/screenshots/screenshot_patient_data.png';
import screenshot_stay_assignments from '../../../../assets/images/screenshots/screenshot_stay_assignments.png';
import screenshot_table from '../../../../assets/images/screenshots/screenshot_table.png';
import screenshot_start_interval from '../../../../assets/images/screenshots/screenshot_start_interval.png';
import screenshot_table_header from '../../../../assets/images/screenshots/screenshot_table_header.png';

export default function HelpInstructions() {
  return (
    <div className={styles.helpInstructions}>
      <HelpSection title="Using the tool" id="using_the_tool">
        <p>
          This tool has been developed with the goal of labelling multiple
          admissions of intensive care patients. Each of the admissions - called{' '}
          <em>stays</em> (for <em>stays in the ICU</em>) - can require an
          arbitrary number of labels. This means that while some admissions will
          require just one label, others can require multiple, or even none.
        </p>
        <p>
          You will be asked to label a specified number of stays that have been
          assigned to your account. Some of these stays will be identical
          between multiple participants and some will be unique to you. This is
          to ensure that we can capture the characteristics of how you approach
          the task of labelling data in comparison to other participants, while
          maximising the number of data-points labelled throughout the study.
        </p>

        <p>
          In order to begin labelling, you should navigate to your{' '}
          <Link to="/participant/stayAssignments">Stay Assignments</Link>, which
          you can do using the tab on the left-hand-side navigation bar.
        </p>
        <HelpSectionImage
          src={screenshot_navbar}
          alt="Navigation bar screenshot."
          description="You can use the navigation bar on the left to navigate between different pages in the tool."
        />
        <p>
          If at any point you would like to return to this page, simply press
          the Help tab in the navigation bar.
        </p>
      </HelpSection>
      <HelpSection title="Assigned stays" id="assigned_stays">
        <p>
          You can preview all of the stays which have been assigned to you by
          navigating to
          <Link to="/participant/stayAssignments">Stay Assignments</Link>; the
          stays assigned to you will be presented in a table which shows you
          your overall progress in the labelling activity.
        </p>

        <HelpSectionImage
          src={screenshot_stay_assignments}
          alt="List of assigned admissions screenshot."
          description="Your assigned admissions are presented in the table, together with their status informing you of whether it has already been labelled."
        />

        <p>
          To select next stay for labelling, simply pressing the blue button
          will take you to the next assigned admission and present you with a
          labelling interface. If for any reason you would prefer to navigate to
          a specific admission, or would like to re-visit an admission you have
          already labelled, you can do so by pressing the arrow button next to
          that admission&apos;s row in the table.
        </p>
        <HelpSectionImage
          src={screenshot_navigating_to_stay_assignment}
          alt="Selecting admission screenshot."
          description='You can automatically load the next admission by pressing the "Take me to the next admission" button at the top of the screen, or navigate to a specific admission by pressing the arrow button.'
        />
      </HelpSection>
      <HelpSection title="Creating labels" id="creating_labels">
        <p>
          Once you have selected an admission to label, you will be presented
          with a labelling interface. The interface consists of several key
          parts you should take note of before you start creating labels.
        </p>
        <p>
          At the very top, you will be able to preview the instructions which
          will aid you in creating the labels.{' '}
          <span className={styles.important}>
            You should read these instructions carefully to ensure that the
            labels you apply the correct labels.{' '}
          </span>
          The instructions will remain the same for all of your assigned
          admissions.
        </p>
        <HelpSectionImage
          src={screenshot_instructions}
          alt="Instructions screenshot."
          description="Please familiarise yourself with the instructions before beginning the labelling process. The instructions will remain the same for all of your assigned admissions."
        />
        <p>
          Next, you will see the overall demographics for the patient whose data
          you are labelling, as well as the details of their admission such as
          the duration of their hospitalisation and stay in the intensive care
          unit.
        </p>
        <HelpSectionImage
          src={screenshot_patient_data}
          alt="Patient demographics screenshot."
          description="Patient demographics and information about their admission."
        />
        <p>
          You will see the list of the labels you have created so far, as well
          as the form of the label you are currently creating below. If you
          cannot see the form, you can bring it up by pressing the{' '}
          <em>Create new label</em> button, or by selecting another interval.
          <span className={styles.important}>
            You should only fill out the form once you have selected the
            interval of time.
          </span>{' '}
          You can do this by scrolling down to the time-series table which
          stores the patient&apos;s parameters throughout their stay in the
          intensive care unit.
        </p>
        <HelpSectionImage
          src={screenshot_table}
          alt="Patient table data screenshot."
          description="Patient's time-series data is contained in the table at the bottom of the labelling interface."
        />
        <p>
          Once you identify the window of time when the label should be placed,
          you can select the <em>start</em> and <em>end</em> intervals. To do
          so, hover over the date you wish to select, and press corresponding
          button. The left button will mark the time as the start time, and the
          right button will mark it as end time. You can select the same time
          for both the start and end time for the same label.{' '}
          <span className={styles.important}>
            You have to select both the start and end intervals for each label.
          </span>
        </p>
        <HelpSectionImage
          src={screenshot_table_header}
          alt="Selecting the start and end times screenshot."
          description="You can select the start and end times for your label by hovering over the table header with the date you want to select and pressing a corresponding button."
        />
        <HelpSectionImage
          src={screenshot_start_interval}
          alt="Marking the start of an interval screenshot."
          description="You mark the start of an interval for a label by pressing the left button."
        />
        <HelpSectionImage
          src={screenshot_end_interval}
          alt="Marking the end of an interval screenshot."
          description="You can mark the end of an interval for a label by pressing the right button."
        />
        <p>
          You are encouraged to fill out the{' '}
          <span className={styles.important}>parameters</span> section of the
          form, if you want to describe the reason for which you have decided to
          apply the label. Selecting the parameters will inform us on their
          importance on the label, and explaining them further in the text boxes
          will provide additional context. Adjusting the{' '}
          <span className={styles.important}>confidence slider</span> will
          improve the performance of your label when we use it to create
          predictive models in the future. If you are unsure of whether the
          label should be placed, simply move it to the left, or if you are
          certain that your label is correct, move it to the right.
        </p>
        <HelpSectionImage
          src={screenshot_form}
          alt="Existing labels and new label form."
          description="You can adjust the label you are creating by filling out the information in the current label's form."
        />
        <p>
          The labels you create will appear above the table with the time-series
          data. You can create new labels using the the{' '}
          <em>Create new label</em> button.
        </p>
        <HelpSectionImage
          src={screenshot_label_list}
          alt="Created labels list screenshot."
          description="Created labels will appear above the table."
        />
        <p>
          When you happy with the labels you have created for a given
          assignment, you need to submit them by pressing the green button that
          reads <em>Mark as labelled (N labels)</em>. If you believe that no
          labels need to be created for this admission, you can mark the
          admission as labelled in the similar fashion by pressing the{' '}
          <em>Mark as labelled (no labels required)</em> button.
        </p>
        <HelpSectionImage
          src={screenshot_mark_as_labelled}
          alt="Marking the admission as labelled screenshot."
          description='To mark the admission as labelled and submit your labels, use the green button that reads "Mark as labelled".'
        />
        <p>
          Upon submitting the created label(s), you will be automatically
          re-directed to the next assigned admission.
        </p>
      </HelpSection>
    </div>
  );
}
