import catchAsync from "../../utils/catchAsync";
import { propertyService } from "./properties.Service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createProperty = catchAsync(async (req, res, next) => {
    const { title, description, price, location, category, imageUrl, isAvailable, } = req.body;
    if (!req.user) {
        throw new Error("Unauthorized");
    }
    const property = await propertyService.createProperty({
        title,
        description,
        price: Number(price),
        location,
        category,
        imageUrl: imageUrl || undefined,
        isAvailable: typeof isAvailable === "boolean"
            ? isAvailable
            : undefined,
        landlordId: req.user.id,
    });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Property created successfully",
        data: property,
    });
});
const getAllProperties = catchAsync(async (req, res, next) => {
    const result = await propertyService.getAllProperties(req.query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getPropertyById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const property = await propertyService.getPropertyById(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property retrieved successfully",
        data: property,
    });
});
const updateProperty = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!req.user) {
        throw new Error("Unauthorized");
    }
    const { title, description, price, location, category, imageUrl, isAvailable, } = req.body;
    const updateData = {};
    if (title !== undefined)
        updateData.title = title;
    if (description !== undefined)
        updateData.description = description;
    if (price !== undefined)
        updateData.price = Number(price);
    if (location !== undefined)
        updateData.location = location;
    if (category !== undefined)
        updateData.category = category;
    if (imageUrl !== undefined)
        updateData.imageUrl = imageUrl;
    if (typeof isAvailable === "boolean")
        updateData.isAvailable = isAvailable;
    const property = await propertyService.updateProperty(id, req.user.id, updateData);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property updated successfully",
        data: property,
    });
});
const deleteProperty = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!req.user) {
        throw new Error("Unauthorized");
    }
    await propertyService.deleteProperty(id, req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property deleted successfully",
        data: null,
    });
});
const getCategories = catchAsync(async (req, res, next) => {
    const categories = await propertyService.getCategories();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories retrieved successfully",
        data: categories,
    });
});
export const propertyController = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getCategories,
};
//# sourceMappingURL=properties.Controller.js.map