import React from "react";
import RegistrarUsuario, { borrarCampos } from "../pages/RegistrarUsuario";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

jest.mock('../pages/RegistrarUsuario', () => ({
  ...jest.requireActual('../pages/RegistrarUsuario'),
  borrarCampos: jest.fn(),
}));

describe("Testing borrarCampos function", () => {
  test("It should clear the form fields", () => {
    let form = {
      name: "John Doe",
      email: "johndoe@example.com",
      message: "Hello, world!",
    };

    borrarCampos(form);

    expect(form).toEqual({
      name: "",
      email: "",
      message: "",
    });
  });
});
