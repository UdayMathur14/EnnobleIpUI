import { environment } from "../../../environments/environment";

const apiPath = environment.apiPath;

export const APIConstant = {
    basePath: apiPath,
    lookup: `/lookup/`,
    plant: `v1/plant/search`,
    plantData : `v1/plant/`,
}