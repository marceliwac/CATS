const BaseModel = require('./BaseModel');

module.exports = class Row extends BaseModel {
  static get tableName() {
    return 'mimiciv_derived.wsl_stage_1';
  }

  static get PARAMETERS() {
    return [
      // eslint-disable
      { key: 'ventilation_type', label: 'Ventilation type' },
      { key: 'ventilator_mode', label: 'Ventilator mode' },
      { key: 'ventilator_mode_hamilton', label: 'Ventilator mode (Hamilton)' },
      { key: 'bipap_mode', label: 'BiPAP mode' },
      { key: 'bipap_epap', label: 'BiPAP EPAP' },
      { key: 'bipap_ipap', label: 'BiPAP IPAP' },
      { key: 'bipap_bpm', label: 'BiPAP BPM' },
      { key: 'o2_delivery_devices', label: 'O2 delivery devices' },
      { key: 'o2_flow', label: 'O2 flow' },
      { key: 'o2_flow_additional', label: 'O2 flow (additional)' },
      { key: 'inspired_o2_fraction', label: 'FiO2' },
      { key: 'respiratory_rate', label: 'Respiratory rate' },
      { key: 'respiratory_rate_set', label: 'Respiratory rate (set)' },
      {
        key: 'respiratory_rate_spontaneous',
        label: 'Respiratory rate (spontaneous)',
      },
      { key: 'respiratory_rate_total', label: 'Respiratory rate (total)' },
      { key: 'expiratory_ratio', label: 'Expiratory ratio' },
      { key: 'inspiratory_ratio', label: 'Inspiratory ratio' },
      { key: 'tidal_volume_set', label: 'Tidal volume (set)' },
      { key: 'tidal_volume_observed', label: 'Tidal volume (observed)' },
      { key: 'tidal_volume_spontaneous', label: 'Tidal volume (spontaneous)' },
      { key: 'minute_volume', label: 'Minute volume' },
      { key: 'percentage_minute_volume', label: 'Minute volume (%)' },
      { key: 'peak_inspiratory_pressure', label: 'Peak inspiratory pressure' },
      { key: 'p_insp_draeger', label: 'Peak inspiratory pressure (Draeger)' },
      { key: 'p_insp_hamilton', label: 'Peak inspiratory pressure (Hamilton)' },
      { key: 'mean_airway_pressure', label: 'Mean airway pressure' },
      { key: 'plateau_pressure', label: 'Plateau pressure' },
      { key: 'cuff_pressure', label: 'Cuff pressure' },
      { key: 'peep_set_cleaned', label: 'PEEP (set)' },
      { key: 'total_peep_level', label: 'PEEP (total)' },
      { key: 'sbt_started', label: 'SBT started' },
      { key: 'sbt_stopped', label: 'SBT stopped' },
      { key: 'sbt_deferred', label: 'SBT deferred' },
      {
        key: 'sbt_successfully_completed',
        label: 'SBT successfully completed',
      },
      { key: 'resistance_expiry', label: 'Resistance (expiry)' },
      { key: 'resistance_inspiry', label: 'Resistance (inspiry)' },

      { key: 'arterial_o2_pressure', label: 'O2 pressure (arterial)' },
      { key: 'arterial_o2_saturation', label: 'O2 saturation (arterial)' },
      {
        key: 'o2_saturation_pulseoxymetry',
        label: 'O2 saturation (pulse oximetry)',
      },
      {
        key: 'arterial_bp_systolic',
        label: 'Blood pressure (arterial, systolic)',
      },
      {
        key: 'arterial_bp_diastolic',
        label: 'Blood pressure (arterial, diastolic)',
      },
      { key: 'arterial_bp_mean', label: 'Blood pressure (arterial, mean)' },
      {
        key: 'bp_systolic_non_invasive',
        label: 'Blood pressure (non-invasive, systolic)',
      },
      {
        key: 'bp_diastolic_non_invasive',
        label: 'Blood pressure (non-invasive, diastolic)',
      },
      {
        key: 'bp_mean_non_invasive',
        label: 'Blood pressure (non-invasive, mean)',
      },
      { key: 'etco2', label: 'EtCO2' },
      { key: 'pcwp', label: 'PCWP' },
      { key: 'heart_rate', label: 'Heart rate' },
      {
        key: 'cardiac_output_thermodilution',
        label: 'Thermodilution cardiac output',
      },
      { key: 'temperature', label: 'Temperature' },
      // eslint-enable
    ];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        stay_id: { type: 'integer' },
        charttime: { type: 'string', format: 'date-time' },
        heart_rate: { type: 'number' },
        arterial_bp_systolic: { type: 'number' },
        arterial_bp_diastolic: { type: 'number' },
        arterial_bp_mean: { type: 'number' },
        bp_systolic_non_invasive: { type: 'number' },
        bp_diastolic_non_invasive: { type: 'number' },
        bp_mean_non_invasive: { type: 'number' },
        cardiac_output_thermodilution: { type: 'number' },
        respiratory_rate: { type: 'number' },
        arterial_o2_pressure: { type: 'number' },
        arterial_o2_saturation: { type: 'number' },
        o2_saturation_pulseoxymetry: { type: 'number' },
        peep_set_cleaned: { type: 'number' },
        temperature: { type: 'numeric' },
        pcwp: { type: 'number' },
        inspired_o2_fraction: { type: 'number' },
        ventilator_mode: { type: 'string' },
        cuff_pressure: { type: 'number' },
        tidal_volume_set: { type: 'number' },
        tidal_volume_observed: { type: 'number' },
        tidal_volume_spontaneous: { type: 'number' },
        minute_volume: { type: 'number' },
        percentage_minute_volume: { type: 'number' },
        respiratory_rate_set: { type: 'number' },
        respiratory_rate_spontaneous: { type: 'number' },
        respiratory_rate_total: { type: 'number' },
        peak_inspiratory_pressure: { type: 'number' },
        plateau_pressure: { type: 'number' },
        mean_airway_pressure: { type: 'number' },
        total_peep_level: { type: 'number' },
        sbt_started: { type: 'string' },
        sbt_stopped: { type: 'string' },
        sbt_successfully_completed: { type: 'string' },
        sbt_deferred: { type: 'string' },
        expiratory_ratio: { type: 'number' },
        inspiratory_ratio: { type: 'number' },
        p_insp_draeger: { type: 'number' },
        bipap_mode: { type: 'string' },
        bipap_epap: { type: 'number' },
        bipap_ipap: { type: 'number' },
        bipap_bpm: { type: 'number' },
        etco2: { type: 'number' },
        ventilator_mode_hamilton: { type: 'string' },
        p_insp_hamilton: { type: 'number' },
        resistance_expiry: { type: 'number' },
        resistance_inspiry: { type: 'number' },
        ventilation_type: { type: 'string' },
        o2_delivery_devices: { type: 'string' },
        o2_flow: { type: 'number' },
        o2_flow_additional: { type: 'number' },
      },
    };
  }
};
