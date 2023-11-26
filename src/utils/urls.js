import configData from "../configData.json";

export const URLS = {
    LOGIN_URL: configData.AWS_REST_ENDPOINT + "/login",
    GET_PRESIGNED_URL: configData.AWS_REST_ENDPOINT + "/uploads",
    POST_USER_URL: configData.AWS_REST_ENDPOINT + "/users",
    POST_VEHICLE_URL: configData.AWS_REST_ENDPOINT + "/vehicles",
    GET_VEHICLES_URL: configData.AWS_REST_ENDPOINT + "/vehicles",
    GET_TRIPS_URL: configData.AWS_REST_ENDPOINT + "/trips",
    POST_TRIPS_URL: configData.AWS_REST_ENDPOINT + "/trips",
    POST_REQUEST_FORGOT_PASS_URL: configData.AWS_REST_ENDPOINT + "/passwords/forgot",
    POST_CHANGE_PASS: configData.AWS_REST_ENDPOINT + "/passwords/change",
    POST_CHANGE_PASS_FIRST_TIME: configData.AWS_REST_ENDPOINT + "/login/new-password",
    PUT_RESERVE_TRAVEL: configData.AWS_REST_ENDPOINT + "/trips",
    DELETE_USER: configData.AWS_REST_ENDPOINT + "/users",
    USER_HISTORY: configData.AWS_REST_ENDPOINT + "/users",
    GET_GAS_PRICE: "http://ec2-54-158-36-197.compute-1.amazonaws.com:5000/api/v1/super_95"
}