import { api } from "../lib/api";

/**
 * 일정 생성 API
 * @param {Object} scheduleData - 일정 생성에 필요한 데이터
 * @returns {Promise}
 */
export const createSchedule = async (scheduleData) => {
    const res = await api.post("/schedule/append", scheduleData);
    return res.data;
};

/**
 * 일정 목록 조회 API
 * @param {string} status - 조회할 일정 상태 (예: "a", "b", "c")
 * @returns {Promise}
 */
export const getScheduleList = async (status = "") => {
    const url = status ? `/schedule/list?chStatus=${status}` : "/schedule/list";
    const res = await api.get(url);
    return res.data;
};

export const getScheduleLocations = async (iSchedulePK) => {
    const res = await api.get(`/schedule/location/list?iSchedulePK=${iSchedulePK}`);
    return res.data;
};

export const getScheduleExpenses = async (iSchedulePK) => {
    const res = await api.get(`/schedule/expense/list?iSchedulePK=${iSchedulePK}`);
    return res.data;
};

export const getScheduleUsers = async (iSchedulePK) => {
    const res = await api.get(`/schedule/user/list?iSchedulePK=${iSchedulePK}`);
    return res.data;
};

/**
 * 일정 내 장소 추가 API
 * @param {Object} data - { iScheduleFK, dtSchedule, strMemo, iLocationFK }
 */
export const addScheduleLocation = async (data) => {
    const res = await api.post("/schedule/location/append", data);
    return res.data;
};
