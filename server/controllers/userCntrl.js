import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
  console.log("### ### ### creating a user ### ### ### ");

  let { email } = req.body;
  const userExist = await prisma.user.findUnique({ where: { email: email } });
  console.log(userExist);
  if (!userExist) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      mesagge: "user registred sucessfully",
      user: user,
    });
  } else {
    res.send(201).json({
      message: " user already register",
    });
  }
});

export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  console.log(`################## [bookVisit]`);
  console.log(email);
  console.log(date);
  console.log(`################## [bookVisit]`);

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
    }
    res.send("your visit os book succesfully");
  } catch (err) {
    throw new Error(err.message);
  }
});

// funcion para optener todos los booking de los usuarios
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});

// funcion para cancelar booking

export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);
    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });
      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to add a resd in favourite of user
export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user.favResindeciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResindeciesID: {
            set: user.favResindeciesID.filter((id) => id !== rid),
          },
        },
      });
      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResindeciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to get all favorites 

//importante !!! favResindeciesID esto es importatntisimo ya que el scham esta escrito asi 
// y en el videoe s diferernte por  en el tuyo.. corregir al final del proyecto.
 
export const getAllfavorites = asyncHandler(async(req, res) => {
  const{email }= req.body;
  try {
    const favResd = await prisma.user.findUnique({
      where:{email},
      select:{ favResindeciesID:true}
    });
    res.status(200).send(favResd)
  }catch(err){
    throw new Error(err.message);
  }
 
});