import { Router } from "express";
import {
  createStore,
  updateStore,
  deleteStore,
  getStores,
  getStoreById,
} from "../../../controllers/store.controller";
import Protect from "../../../middlewares/checkAuth.mdw";
import uploadFile from "../../../middlewares/upload.mdw";


const storeRouter = Router({ mergeParams: true });

storeRouter.post("/", Protect, uploadFile, createStore);
storeRouter.put("/:id", Protect, uploadFile, updateStore);
storeRouter.delete("/:id", Protect, deleteStore);
storeRouter.get("/", Protect, getStores);
storeRouter.get("/:id", Protect, getStoreById);

export default storeRouter;