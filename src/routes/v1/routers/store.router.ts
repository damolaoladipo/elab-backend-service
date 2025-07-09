import { Router } from "express";
import {
  createStore,
  updateStore,
  deleteStore,
  getStores,
  publishStore,
  unpublishStore,
  getStoreItem,
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
storeRouter.get("/:slug", getStoreItem);

export default storeRouter;