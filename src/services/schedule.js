import { api } from "../lib/api";

/**
 * 일정 생성 API
 * @param {Object} scheduleData - 일정 생성에 필요한 데이터
 * @returns {Promise}
 */
export const createSchedule = async (scheduleData) => {
    const res = await api.post("/schedule/create", scheduleData);
    return res.data;
};
