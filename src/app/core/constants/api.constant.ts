import { environment } from "../../../environments/environment";

const apiPath = environment.apiPath;

export const APIConstant = {
    basePath: apiPath,
    lookup: `/lookup/`,
    plant: `v1/plant/search`,
    plantData : `v1/plant/`,
    updatePlant : `v1/plant/update/`,
    pointCharge: `v1/pointCharge/search`,
    parts : `v1/part/search`,
    partData : `v1/part/`,
    updatePart : `v1/part/update/`,
}