SELECT
    stay_id,
    admission_age AS age,
    race,
    gender,
    admittime AS admission_time,
    dischtime AS discharge_time,
    CAST (dod AS TIMESTAMP) AS day_of_death,
    los_hospital AS length_of_stay_hospital,
    hospstay_seq AS seq_hospital_stay,
    los_icu AS length_of_stay_icu,
    icustay_seq AS seq_icu_stay
FROM mimiciv_derived.icustay_detail
WHERE stay_id = ??;
