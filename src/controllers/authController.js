import express from "express";

export async function login(req, res, next) {
  try {
    return res.status(200).json({ message: "Hi thereee" });
  } catch (error) {
    next(error);
  }
}
