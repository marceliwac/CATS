const fs = require('fs');
const path = require('path');

const SQL_DIR_PATH = './sql';
const STAYS_QUERY = 'stays.sql';
const STAY_DETAILS_QUERY = 'stay_details.sql';
const STAY_DATA_QUERY = 'stay_data.sql';

function readFile(filename) {
  return fs
    .readFileSync(path.join(__dirname, SQL_DIR_PATH, filename))
    .toString();
}

function floatStringTo2SF(text) {
  return Number.parseFloat(Number.parseFloat(text).toFixed(2));
}

async function stays(knex) {
  const result = await knex.raw(readFile(STAYS_QUERY));
  if (Array.isArray(result.rows)) {
    return result.rows.map((row) => ({
      stayId: row.stay_id,
    }));
  }
  return null;
}

async function stayDetails(knex, stayId) {
  const result = await knex.raw(readFile(STAY_DETAILS_QUERY), stayId);
  if (Array.isArray(result.rows)) {
    if (result.rows.length === 1) {
      const row = result.rows[0];
      return {
        stayId: row.stay_id,
        age: floatStringTo2SF(row.age),
        race: row.race,
        gender: row.gender,
        admissionTime: row.admission_time,
        dischargeTime: row.discharge_time,
        deathTime: row.day_of_death,
        lengthOfStayHospital: floatStringTo2SF(row.length_of_stay_hospital),
        lengthOfStayIcu: floatStringTo2SF(row.length_of_stay_icu),
        seqHospital: floatStringTo2SF(row.seq_hospital_stay, 0),
        seqIcu: floatStringTo2SF(row.seq_icu_stay, 0),
      };
    }
  }
  return null;
}

async function stayData(knex, stayId, simplify = true) {
  const result = await knex.raw(readFile(STAY_DATA_QUERY), stayId);
  if (Array.isArray(result.rows)) {
    if (simplify) {
      return result.rows.map((row) => {
        const simplified = {};
        Object.keys(row).forEach((key) => {
          if (row[key] !== null) {
            simplified[key] = row[key];
          }
        });
        return simplified;
      });
    }
    return result.rows;
  }
  return null;
}

module.exports = {
  stayDetails,
  stayData,
  stays,
};
