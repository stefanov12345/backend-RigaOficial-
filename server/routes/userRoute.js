import express from "express";
import { bookVisit, cancelBooking, createUser, getAllBookings, getAllfavorites, toFav} from "../controllers/userCntrl.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/bookVisit/:id", bookVisit);
router.post("/allBooking", getAllBookings) 
router.post("/removeBooking/:id",cancelBooking)
router.post("/toFav/:rid", toFav)
router.post("/allFav/", getAllfavorites)

export { router as userRoute };
