import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { OutlinedInput } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import FormControl from '@mui/material/FormControl';
import styles from '../../../../../StayAssignment/LabelList/CurrentLabel/ParameterSelector/ParameterSelector.module.scss';

const operationOptions = [
  {
    value: '<',
    label: 'Smaller than',
  },
  {
    value: '>',
    label: 'Greater than',
  },
  {
    value: '=',
    label: 'Equal to',
  },
  {
    value: '!=',
    label: 'Not equal to',
  },
];

const parameterOptions = [
  { value: 'heart_rate', label: 'Heart Rate [bpm]' },
  {
    value: 'arterial_bp_systolic',
    label: 'Arterial Blood Pressure Systolic [mmHg]',
  },
  {
    value: 'arterial_bp_diastolic',
    label: 'Arterial Blood Pressure Diastolic [mmHg]',
  },
  {
    value: 'arterial_bp_mean',
    label: 'Arterial Blood Pressure Mean [mmHg]',
  },
  {
    value: 'bp_systolic_non_invasive',
    label: 'Non-invasive Blood Pressure Systolic [mmHg]',
  },
  {
    value: 'bp_diastolic_non_invasive',
    label: 'Non-invasive Blood Pressure Diastolic [mmHg]',
  },
  {
    value: 'bp_mean_non_invasive',
    label: 'Non-invasive Blood Pressure Mean [mmHg]',
  },
  {
    value: 'cardiac_output_thermodilution',
    label: 'Cardiac Output (thermodilution) [L/min]',
  },
  { value: 'respiratory_rate', label: 'Respiratory Rate [insp/min]' },
  {
    value: 'arterial_o2_pressure',
    label: 'Arterial O2 Pressure [mmHg]',
  },
  {
    value: 'arterial_o2_saturation',
    label: 'Arterial O2 Saturation [%]',
  },
  {
    value: 'o2_saturation_pulseoxymetry',
    label: 'O2 Saturation (pulseoximetry) [%]',
  },
  { value: 'peep_set_cleaned', label: 'PEEP Set [cm H2O]' },
  { value: 'temperature', label: 'Temperature [C]' },
  { value: 'pcwp', label: 'PCWP [mmHg]' },
  { value: 'inspired_o2_fraction', label: 'FiO2 [%]' },
  { value: 'ventilator_mode', label: 'Ventilator Mode' },
  { value: 'cuff_pressure', label: 'Cuff Pressure [cm H2O]' },
  { value: 'tidal_volume_set', label: 'Tidal Volume (set) [mL]' },
  {
    value: 'tidal_volume_observed',
    label: 'Tidal Volume (observed) [mL]',
  },
  {
    value: 'tidal_volume_spontaneous',
    label: 'Tidal Volume (spontaneous) [mL]',
  },
  { value: 'minute_volume', label: 'Minute Volume [L/min]' },
  {
    value: 'percentage_minute_volume',
    label: 'Minute Volume Target (for IBW) [%]',
  },
  {
    value: 'respiratory_rate_set',
    label: 'Respiratory Rate (set) [insp/min]',
  },
  {
    value: 'respiratory_rate_spontaneous',
    label: 'Respiratory Rate (spontaneous) [insp/min]',
  },
  {
    value: 'respiratory_rate_total',
    label: 'Respiratory Rate (total) [insp/min]',
  },
  {
    value: 'peak_inspiratory_pressure',
    label: 'Peak Inspiratory Pressure [cm H2O]',
  },
  { value: 'plateau_pressure', label: 'Plateau Pressure [cm H2O]' },
  {
    value: 'mean_airway_pressure',
    label: 'Mean Airway Pressure [cm H2O]',
  },
  { value: 'total_peep_level', label: 'Total PEEP Level [cm H2O]' },
  { value: 'sbt_started', label: 'SBT Started' },
  { value: 'sbt_stopped', label: 'SBT Stopped' },
  { value: 'sbt_successfully_completed', label: 'SBT Succeeded' },
  { value: 'sbt_deferred', label: 'SBT Deferred' },
  { value: 'expiratory_ratio', label: 'Expiratory Ratio' },
  { value: 'inspiratory_ratio', label: 'Inspiratory Ratio' },
  {
    value: 'p_insp_draeger',
    label: 'Inspiratory Pressure (Draeger) [cm H2O]',
  },
  { value: 'bipap_mode', label: 'BiPAP Mode' },
  { value: 'bipap_epap', label: 'BiPAP EPAP [cm H2O]' },
  { value: 'bipap_ipap', label: 'BiPAP IPAP [cm H2O]' },
  { value: 'bipap_bpm', label: 'BIPAP BPM (S/T - back up) [bmp]' },
  { value: 'etco2', label: 'EtCO2 [mmHg]' },
  {
    value: 'ventilator_mode_hamilton',
    label: 'Ventilator Mode (Hamilton)',
  },
  {
    value: 'p_insp_hamilton',
    label: 'Inspiratory Pressure (Hamilton) [cm H2O)',
  },
  {
    value: 'resistance_expiry',
    label: 'Resistance (exipiratory) [cm H2O/L/sec]',
  },
  {
    value: 'resistance_inspiry',
    label: 'Resistance (inspiratory) [cm H2O/L/sec]',
  },
  { value: 'o2_delivery_devices', label: 'Oxygen Delivery Devices' },
  { value: 'o2_flow', label: 'Oxygen Flow [L/min]' },
  {
    value: 'o2_flow_additional',
    label: 'Oxygen Flow (additional) [L/min]',
  },
];
export default function RuleNodeForm(props) {
  const { id, operation, parameter, value } = props;
  const [operationInput, setOperationInput] = React.useState(operation);
  const [parameterInput, setParameterInput] = React.useState(parameter);
  const [valueInput, setValueInput] = React.useState(value);

  return (
    <div className={styles.ruleNodeForm}>
      <FormControl sx={{ m: 1, width: 300 }} className={styles.selector}>
        <InputLabel id={`${id}-parameter-label`}>Parameter</InputLabel>
        <Select
          labelId={`${id}-parameter-label`}
          id="parameters-checkbox"
          label="Parameter"
          value={parameterInput}
          onChange={(e) => setParameterInput(e.target.value)}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 10.5 + 8,
                // width: 250,
              },
            },
          }}
        >
          {parameterOptions.map((option) => (
            <MenuItem
              key={`${id}-parameter-${option.value}`}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 300 }} className={styles.selector}>
        <InputLabel id={`${id}-operation-label`}>
          How to compare this parameter...
        </InputLabel>
        <Select
          labelId={`${id}-operation-label`}
          id={`${id}-operation`}
          label="How to compare this parameter..."
          value={operationInput}
          onChange={(e) => setOperationInput(e.target.value)}
        >
          {operationOptions.map((option) => (
            <MenuItem
              key={`${id}-operation-${option.value}`}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 300 }} className={styles.selector}>
        <OutlinedInput
          label="Value"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
        />
      </FormControl>
    </div>
  );
}
