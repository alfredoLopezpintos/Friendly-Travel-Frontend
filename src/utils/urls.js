import configData from "../configData.json";

export const URLS = {
    LOGIN_URL: configData.AWS_REST_ENDPOINT + "/login",
    GET_PRESIGNED_URL: configData.AWS_REST_ENDPOINT + "/uploads",
    POST_USER_URL: configData.AWS_REST_ENDPOINT + "/users",
    POST_VEHICLE_URL: configData.AWS_REST_ENDPOINT + "/vehicles",
    POST_REQUEST_FORGOT_PASS_URL: configData.AWS_REST_ENDPOINT + "/passwords/forgot"
}