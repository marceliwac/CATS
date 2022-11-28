const BaseModel = require('./BaseModel');

module.exports = class Row extends BaseModel {
  static get tableName() {
    return 'mimiciv_derived.wsl_stage_1';
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
