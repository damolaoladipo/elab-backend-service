import { Router } from "express";
import {
  createStore,
  updateStore,
  deleteStore,
  getStores,
  getStoreById,
  publishStore,
  unpublishStore,
  getStoreItemBySlug,
} from "../../../controllers/store.controller";
import Protect from "../../../middlewares/checkAuth.mdw";
import uploadFile from "../../../middlewares/upload.mdw";


const storeRouter = Router({ mergeParams: true });

storeRouter.post("/", Protect, uploadFile, createStore);
storeRouter.post("/:id/publish", Protect, publishStore);
storeRouter.post("/:id/unpublish", Protect, unpublishStore);
storeRouter.put("/:id", Protect, uploadFile, updateStore);
storeRouter.delete("/:id", Protect, deleteStore);
storeRouter.get("/", getStores);
storeRouter.get("/:id", getStoreById);
storeRouter.get("/:slug", getStoreItemBySlug);

export default storeRouter;