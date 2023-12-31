import React from 'react';
import Typography from '@mui/material/Typography';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import StraightOutlinedIcon from '@mui/icons-material/StraightOutlined';
import TurnSlightRightOutlinedIcon from '@mui/icons-material/TurnSlightRightOutlined';
import TurnSlightLeftOutlinedIcon from '@mui/icons-material/TurnSlightLeftOutlined';
import ForkLeftOutlinedIcon from '@mui/icons-material/ForkLeftOutlined';
import ForkRightOutlinedIcon from '@mui/icons-material/ForkRightOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';

const NONE_OPTION_VALUE = '(none)';
const OPERATION_SET = '!!';
const OPERATION_NOT_SET = '!';
const OPERATION_INCREASES = 'inc';
const OPERATION_INCREASES_REMAINS = 'increm';
const OPERATION_REMAINS = 'rem';
const OPERATION_DECREASES = 'dec';
const OPERATION_DECREASES_REMAINS = 'decrem';

function MenuItemTypographyIcon(props) {
  const { value } = props;
  return (
    <Typography
      sx={{
        flexGrow: 0.5,
        fontWeight: 700,
        textAlign: 'center',
      }}
    >
      {value}
    </Typography>
  );
}

export default {
  nodeSize: {
    x: 400,
    y: 250,
  },
  get depthFactor() {
    return this.nodeSize.x * this.separation.siblings;
  },
  separation: {
    siblings: 1.25,
    nonSiblings: 1.5,
  },
  relation: {
    operationOptions: [
      {
        value: 'OR',
        label: 'At least one rule matches',
        icon: <RuleOutlinedIcon />,
      },
      {
        value: 'AND',
        label: 'All rules match',
        icon: <ChecklistRtlOutlinedIcon />,
      },
    ],
  },
  rule: {
    noneOptionValue: NONE_OPTION_VALUE,
    operationSet: OPERATION_SET,
    operationNotSet: OPERATION_NOT_SET,
    noValueOperations: [
      OPERATION_SET,
      OPERATION_NOT_SET,
      OPERATION_INCREASES,
      OPERATION_INCREASES_REMAINS,
      OPERATION_REMAINS,
      OPERATION_DECREASES,
      OPERATION_DECREASES_REMAINS,
    ],
    operationOptionsValue: [
      {
        value: '<',
        label: 'Smaller than',
        icon: <MenuItemTypographyIcon value="<" />,
      },
      {
        value: '>',
        label: 'Greater than',
        icon: <MenuItemTypographyIcon value=">" />,
      },
      {
        value: '=',
        label: 'Equal to',
        icon: <MenuItemTypographyIcon value="=" />,
      },
      {
        value: '!=',
        label: 'Not equal to',
        icon: <MenuItemTypographyIcon value="≠" />,
      },
      {
        value: OPERATION_SET,
        label: 'Set',
        icon: <CheckCircleOutlinedIcon />,
      },
      {
        value: OPERATION_NOT_SET,
        label: 'Not set',
        icon: <CancelOutlinedIcon />,
      },
      {
        value: OPERATION_INCREASES,
        label: 'Increases',
        icon: (
          <TurnSlightLeftOutlinedIcon sx={{ transform: 'rotate(90deg)' }} />
        ),
      },
      {
        value: OPERATION_INCREASES_REMAINS,
        label: "Increases or doesn't change",
        icon: <ForkLeftOutlinedIcon sx={{ transform: 'rotate(90deg)' }} />,
      },
      {
        value: OPERATION_REMAINS,
        label: "Doesn't change",
        icon: <StraightOutlinedIcon sx={{ transform: 'rotate(90deg)' }} />,
      },
      {
        value: OPERATION_DECREASES_REMAINS,
        label: "Decreases or doesn't change",
        icon: <ForkRightOutlinedIcon sx={{ transform: 'rotate(90deg)' }} />,
      },
      {
        value: OPERATION_DECREASES,
        label: 'Decreases',
        icon: (
          <TurnSlightRightOutlinedIcon sx={{ transform: 'rotate(90deg)' }} />
        ),
      },
    ],
    operationOptionsSelection: [
      {
        value: '=',
        label: 'One of',
        icon: <PlaylistAddCheckOutlinedIcon />,
      },
      {
        value: '!=',
        label: 'Not one of',
        icon: <PlaylistRemoveOutlinedIcon />,
      },
    ],
    parameterOptions: [
      {
        value: 'arterial_bp_diastolic',
        label: 'Arterial Blood Pressure Diastolic ',
        unit: 'mmHg',
      },
      {
        value: 'arterial_bp_mean',
        label: 'Arterial Blood Pressure Mean ',
        unit: 'mmHg',
      },
      {
        value: 'arterial_bp_systolic',
        label: 'Arterial Blood Pressure Systolic ',
        unit: 'mmHg',
      },
      {
        value: 'arterial_o2_pressure',
        label: 'Arterial O2 Pressure ',
        unit: 'mmHg',
      },
      {
        value: 'arterial_o2_saturation',
        label: 'Arterial O2 Saturation ',
        unit: '%',
      },
      {
        value: 'bipap_bpm',
        label: 'BIPAP BPM (S/T - back up) ',
        unit: 'bmp',
      },
      { value: 'bipap_epap', label: 'BiPAP EPAP ', unit: 'cm H2O' },
      { value: 'bipap_ipap', label: 'BiPAP IPAP ', unit: 'cm H2O' },
      { value: 'bipap_mode', label: 'BiPAP Mode', unit: '' },
      {
        value: 'bp_diastolic_non_invasive',
        label: 'Non-invasive Blood Pressure Diastolic ',
        unit: 'mmHg',
      },
      {
        value: 'bp_mean_non_invasive',
        label: 'Non-invasive Blood Pressure Mean ',
        unit: 'mmHg',
      },
      {
        value: 'bp_systolic_non_invasive',
        label: 'Non-invasive Blood Pressure Systolic ',
        unit: 'mmHg',
      },
      {
        value: 'cardiac_output_thermodilution',
        label: 'Cardiac Output (thermodilution) ',
        unit: 'L/min',
      },
      { value: 'cuff_pressure', label: 'Cuff Pressure ', unit: 'cm H2O' },
      { value: 'etco2', label: 'EtCO2 ', unit: 'mmHg' },
      { value: 'expiratory_ratio', label: 'Expiratory Ratio', unit: '' },
      { value: 'heart_rate', label: 'Heart Rate ', unit: 'bpm' },
      { value: 'inspiratory_ratio', label: 'Inspiratory Ratio', unit: '' },
      { value: 'inspired_o2_fraction', label: 'FiO2 ', unit: '%' },
      {
        value: 'mean_airway_pressure',
        label: 'Mean Airway Pressure ',
        unit: 'cm H2O',
      },
      { value: 'minute_volume', label: 'Minute Volume ', unit: 'L/min' },
      {
        value: 'o2_delivery_devices',
        label: 'Oxygen Delivery Devices',
        unit: '',
      },
      { value: 'o2_flow', label: 'Oxygen Flow ', unit: 'L/min' },
      {
        value: 'o2_flow_additional',
        label: 'Oxygen Flow (additional) ',
        unit: 'L/min',
      },
      {
        value: 'o2_saturation_pulseoxymetry',
        label: 'O2 Saturation (pulseoximetry) ',
        unit: '%',
      },
      {
        value: 'p_insp_draeger',
        label: 'Inspiratory Pressure (Draeger) ',
        unit: 'cm H2O',
      },
      {
        value: 'p_insp_hamilton',
        label: 'Inspiratory Pressure (Hamilton) [cm H2O)',
        unit: '',
      },
      { value: 'pcwp', label: 'PCWP ', unit: 'mmHg' },
      {
        value: 'peak_inspiratory_pressure',
        label: 'Peak Inspiratory Pressure ',
        unit: 'cm H2O',
      },
      { value: 'peep_set_cleaned', label: 'PEEP Set ', unit: 'cm H2O' },
      {
        value: 'percentage_minute_volume',
        label: 'Minute Volume Target (for IBW) ',
        unit: '%',
      },
      {
        value: 'plateau_pressure',
        label: 'Plateau Pressure ',
        unit: 'cm H2O',
      },
      {
        value: 'resistance_expiry',
        label: 'Resistance (exipiratory) ',
        unit: 'cm H2O/L/sec',
      },
      {
        value: 'resistance_inspiry',
        label: 'Resistance (inspiratory) ',
        unit: 'cm H2O/L/sec',
      },
      {
        value: 'respiratory_rate',
        label: 'Respiratory Rate ',
        unit: 'insp/min',
      },
      {
        value: 'respiratory_rate_set',
        label: 'Respiratory Rate (set) ',
        unit: 'insp/min',
      },
      {
        value: 'respiratory_rate_spontaneous',
        label: 'Respiratory Rate (spontaneous) ',
        unit: 'insp/min',
      },
      {
        value: 'respiratory_rate_total',
        label: 'Respiratory Rate (total) ',
        unit: 'insp/min',
      },
      { value: 'sbt_deferred', label: 'SBT Deferred', unit: '' },
      { value: 'sbt_started', label: 'SBT Started', unit: '' },
      { value: 'sbt_stopped', label: 'SBT Stopped', unit: '' },
      {
        value: 'sbt_successfully_completed',
        label: 'SBT Succeeded',
        unit: '',
      },
      { value: 'temperature', label: 'Temperature ', unit: 'C' },
      {
        value: 'tidal_volume_observed',
        label: 'Tidal Volume (observed) ',
        unit: 'ml',
      },
      {
        value: 'tidal_volume_set',
        label: 'Tidal Volume (set) ',
        unit: 'ml',
      },
      {
        value: 'tidal_volume_spontaneous',
        label: 'Tidal Volume (spontaneous) ',
        unit: 'ml',
      },
      {
        value: 'total_peep_level',
        label: 'Total PEEP Level ',
        unit: 'cm H2O',
      },
      { value: 'ventilator_mode', label: 'Ventilator Mode', unit: '' },
      {
        value: 'ventilator_mode_hamilton',
        label: 'Ventilator Mode (Hamilton)',
        unit: '',
      },
    ],
    parameterSelection: {
      ventilator_mode: [
        { value: NONE_OPTION_VALUE, label: '(none)' },
        { value: 'APRV', label: 'APRV' },
        { value: 'APRV/Biphasic+ApnVol', label: 'APRV/Biphasic+ApnVol' },
        { value: 'APV (cmv)', label: 'APV (cmv)' },
        { value: 'Ambient', label: 'Ambient' },
        { value: 'Apnea Ventilation', label: 'Apnea Ventilation' },
        { value: 'CMV', label: 'CMV' },
        { value: 'CMV/ASSIST', label: 'CMV/ASSIST' },
        { value: 'CMV/ASSIST/AutoFlow', label: 'CMV/ASSIST/AutoFlow' },
        { value: 'CMV/AutoFlow', label: 'CMV/AutoFlow' },
        { value: 'CPAP', label: 'CPAP' },
        { value: 'CPAP/PPS', label: 'CPAP/PPS' },
        { value: 'CPAP/PSV', label: 'CPAP/PSV' },
        { value: 'CPAP/PSV+Apn TCPL', label: 'CPAP/PSV+Apn TCPL' },
        { value: 'CPAP/PSV+ApnPres', label: 'CPAP/PSV+ApnPres' },
        { value: 'CPAP/PSV+ApnVol', label: 'CPAP/PSV+ApnVol' },
        { value: 'MMV', label: 'MMV' },
        { value: 'MMV/AutoFlow', label: 'MMV/AutoFlow' },
        { value: 'MMV/PSV', label: 'MMV/PSV' },
        { value: 'MMV/PSV/AutoFlow', label: 'MMV/PSV/AutoFlow' },
        { value: 'P-CMV', label: 'P-CMV' },
        { value: 'PCV+', label: 'PCV+' },
        { value: 'PCV+/PSV', label: 'PCV+/PSV' },
        { value: 'PCV+Assist', label: 'PCV+Assist' },
        { value: 'PRES/AC', label: 'PRES/AC' },
        { value: 'PRVC/AC', label: 'PRVC/AC' },
        { value: 'PRVC/SIMV', label: 'PRVC/SIMV' },
        { value: 'PSV/SBT', label: 'PSV/SBT' },
        { value: 'SIMV', label: 'SIMV' },
        { value: 'SIMV/AutoFlow', label: 'SIMV/AutoFlow' },
        { value: 'SIMV/PRES', label: 'SIMV/PRES' },
        { value: 'SIMV/PSV', label: 'SIMV/PSV' },
        { value: 'SIMV/PSV/AutoFlow', label: 'SIMV/PSV/AutoFlow' },
        { value: 'SIMV/VOL', label: 'SIMV/VOL' },
        { value: 'SPONT', label: 'SPONT' },
        { value: 'SYNCHRON MASTER', label: 'SYNCHRON MASTER' },
        { value: 'SYNCHRON SLAVE', label: 'SYNCHRON SLAVE' },
        { value: 'Standby', label: 'Standby' },
        { value: 'VOL/AC', label: 'VOL/AC' },
      ],
      ventilator_mode_hamilton: [
        { value: NONE_OPTION_VALUE, label: '(none)' },
        { value: '(S) CMV', label: '(S) CMV' },
        { value: 'APRV', label: 'APRV' },
        { value: 'APV (cmv)', label: 'APV (cmv)' },
        { value: 'APV (simv)', label: 'APV (simv)' },
        { value: 'ASV', label: 'ASV' },
        { value: 'Ambient', label: 'Ambient' },
        { value: 'DuoPaP', label: 'DuoPaP' },
        { value: 'NIV', label: 'NIV' },
        { value: 'NIV-ST', label: 'NIV-ST' },
        { value: 'P-CMV', label: 'P-CMV' },
        { value: 'P-SIMV', label: 'P-SIMV' },
        { value: 'SIMV', label: 'SIMV' },
        { value: 'SPONT', label: 'SPONT' },
        { value: 'VS', label: 'VS' },
        { value: 'nCPAP-PS', label: 'nCPAP-PS' },
      ],
      sbt_started: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
      sbt_stopped: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
      sbt_successfully_completed: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
      sbt_deferred: [
        { value: 'RSBI > 105', label: 'RSBI > 105' },
        { value: 'Unable to perform RSBI', label: 'Unable to perform RSBI' },
        {
          value: 'Chronic vent dependent patient',
          label: 'Chronic vent dependent patient',
        },
        { value: 'Pending procedure ', label: 'Pending procedure ' },
      ],
      bipap_mode: [
        { value: NONE_OPTION_VALUE, label: '(none)' },
        { value: 'Not applicable', label: 'Not applicable' },
        { value: 'Spontaneous (S)', label: 'Spontaneous (S)' },
        { value: 'Timed (T)', label: 'Timed (T)' },
        {
          value: 'Spontaneous/Timed (S/T) (Back up)',
          label: 'Spontaneous/Timed (S/T) (Back up)',
        },
      ],
      o2_delivery_devices: [
        { value: NONE_OPTION_VALUE, label: '(none)' },
        { value: 'Aerosol-cool', label: 'Aerosol-cool' },
        { value: 'Bipap mask', label: 'Bipap mask' },
        { value: 'CPAP mask', label: 'CPAP mask' },
        { value: 'Endotracheal tube', label: 'Endotracheal tube' },
        { value: 'Face tent', label: 'Face tent' },
        {
          value: 'High flow nasal cannula',
          label: 'High flow nasal cannula',
        },
        { value: 'High flow neb', label: 'High flow neb' },
        { value: 'Medium conc mask', label: 'Medium conc mask' },
        { value: 'Nasal cannula', label: 'Nasal cannula' },
        { value: 'Non-rebreather', label: 'Non-rebreather' },
        { value: 'None', label: 'None (explicitly)' },
        { value: 'Other', label: 'Other' },
        { value: 'Oxymizer', label: 'Oxymizer' },
        { value: 'T-piece', label: 'T-piece' },
        { value: 'Trach mask', label: 'Trach mask' },
        { value: 'Tracheostomy tube', label: 'Tracheostomy tube' },
        { value: 'Ultrasonic neb', label: 'Ultrasonic neb' },
        { value: 'Vapomist', label: 'Vapomist' },
        { value: 'Venti mask', label: 'Venti mask' },
      ],
    },
  },
};
