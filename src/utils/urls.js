import configData from "../configData.json";

export const URLS = {
    GET_PRESIGNED_URL: configData.AWS_REST_ENDPOINT + "/uploads",
    POST_USER_URL: configData.AWS_REST_ENDPOINT + "/users"
}