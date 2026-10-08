#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /src and /scripts directories to /example based on user input and creates a new /src/app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

// Esta línea sirve para declarar «fs» con el valor «require("fs")».
const fs = require("fs");
// Esta línea sirve para declarar «path» con el valor «require("path")».
const path = require("path");
// Esta línea sirve para declarar «readline» con el valor «require("readline")».
const readline = require("readline");

// Esta línea sirve para declarar «root» con el valor «process.cwd()».
const root = process.cwd();
// Esta línea sirve para declarar «oldDirs» con el valor «["src", "scripts"]».
const oldDirs = ["src", "scripts"];
// Esta línea sirve para declarar «exampleDir» con el valor «"example"».
const exampleDir = "example";
// Esta línea sirve para declarar «newAppDir» con el valor «"src/app"».
const newAppDir = "src/app";
// Esta línea sirve para declarar «exampleDirPath» con el valor «path.join(root, exampleDir)».
const exampleDirPath = path.join(root, exampleDir);

// Esta línea sirve para extraer «ndexConten» de «`import { Text, View, StyleSheet } from ».
const indexContent = `import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
`;

// Esta línea sirve para declarar «layoutContent» con el valor «`import { Stack } from "expo-router"».
const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

// Esta línea sirve para declarar «rl» con el valor «readline.createInterface({».
const rl = readline.createInterface({
  // Esta línea sirve para declarar la propiedad «input» con el valor o tipo «process.stdin».
  input: process.stdin,
  // Esta línea sirve para declarar la propiedad «output» con el valor o tipo «process.stdout».
  output: process.stdout,
});

// Esta línea sirve para declarar «moveDirectories» con el valor «async (userInput) => {».
const moveDirectories = async (userInput) => {
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para revisar si «userInput === "y"».
    if (userInput === "y") {
      // Create the app-example directory
      // Esta línea sirve para esperar el resultado de «fs.promises.mkdir».
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      // Esta línea sirve para llamar a «console.log» con «`📁 /${exampleDir} directory created.`».
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    // Esta línea sirve para recorrer los elementos con «const dir of oldDirs».
    for (const dir of oldDirs) {
      // Esta línea sirve para extraer «ldDirPat» de «path.join(root, dir)».
      const oldDirPath = path.join(root, dir);
      // Esta línea sirve para revisar si «fs.existsSync(oldDirPath)».
      if (fs.existsSync(oldDirPath)) {
        // Esta línea sirve para revisar si «userInput === "y"».
        if (userInput === "y") {
          // Esta línea sirve para extraer «ewDirPat» de «path.join(root, exampleDir, dir)».
          const newDirPath = path.join(root, exampleDir, dir);
          // Esta línea sirve para esperar el resultado de «fs.promises.rename».
          await fs.promises.rename(oldDirPath, newDirPath);
          // Esta línea sirve para mostrar que la carpeta fue movida.
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        // Esta línea sirve para ejecutar este bloque en el caso contrario.
        } else {
          // Esta línea sirve para esperar el resultado de «fs.promises.rm».
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          // Esta línea sirve para llamar a «console.log» con «`❌ /${dir} deleted.`».
          console.log(`❌ /${dir} deleted.`);
        }
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para llamar a «console.log» con «`➡️ /${dir} does not exist, skipping.`».
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /src/app directory
    // Esta línea sirve para extraer «ewAppDirPat» de «path.join(root, newAppDir)».
    const newAppDirPath = path.join(root, newAppDir);
    // Esta línea sirve para esperar el resultado de «fs.promises.mkdir».
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    // Esta línea sirve para llamar a «console.log» con «"\n📁 New /src/app directory created."».
    console.log("\n📁 New /src/app directory created.");

    // Create index.tsx
    // Esta línea sirve para extraer «ndexPat» de «path.join(newAppDirPath, "index.tsx")».
    const indexPath = path.join(newAppDirPath, "index.tsx");
    // Esta línea sirve para esperar el resultado de «fs.promises.writeFile».
    await fs.promises.writeFile(indexPath, indexContent);
    // Esta línea sirve para llamar a «console.log» con «"📄 src/app/index.tsx created."».
    console.log("📄 src/app/index.tsx created.");

    // Create _layout.tsx
    // Esta línea sirve para extraer «ayoutPat» de «path.join(newAppDirPath, "_layout.tsx")».
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    // Esta línea sirve para esperar el resultado de «fs.promises.writeFile».
    await fs.promises.writeFile(layoutPath, layoutContent);
    // Esta línea sirve para llamar a «console.log» con «"📄 src/app/_layout.tsx created."».
    console.log("📄 src/app/_layout.tsx created.");

    // Esta línea sirve para mostrar que el reinicio terminó.
    console.log("\n✅ Project reset complete. Next steps:");
    // Esta línea sirve para llamar a «console.log» con los argumentos de las líneas siguientes.
    console.log(
      // Esta línea sirve para incluir el texto o las clases «1. Run \…».
      `1. Run \`npx expo start\` to start a development server.\n2. Edit src/app/index.tsx to edit the main screen.\n3. Put all your application code in /src, only screens and layout files should be in /src/app.${
        // Esta línea sirve para revisar si el usuario pidió borrar la carpeta de ejemplos.
        userInput === "y"
          // Esta línea sirve para mostrar cómo borrar la carpeta de ejemplos.
          ? `\n4. Delete the /${exampleDir} directory when you're done referencing it.`
          // Esta línea sirve para omitir el texto extra en caso contrario.
          : ""
      // Esta línea sirve para cerrar el mensaje de pasos siguientes.
      }`
    );
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch (error) {
    // Esta línea sirve para mostrar el error ocurrido durante la ejecución.
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

// Esta línea sirve para llamar a «rl.question» con los argumentos de las líneas siguientes.
rl.question(
  // Esta línea sirve para incluir el texto o las clases «Do you want to move existing files to /exampl…».
  "Do you want to move existing files to /example instead of deleting them? (Y/n): ",
  // Esta línea sirve para declarar la función que recibe la respuesta del usuario.
  (answer) => {
    // Esta línea sirve para extraer «serInpu» de «answer.trim().toLowerCase() || "y"».
    const userInput = answer.trim().toLowerCase() || "y";
    // Esta línea sirve para revisar si «userInput === "y" || userInput === "n"».
    if (userInput === "y" || userInput === "n") {
      // Esta línea sirve para llamar a «moveDirectories» con «userInput).finally(() => rl.close()».
      moveDirectories(userInput).finally(() => rl.close());
    // Esta línea sirve para ejecutar este bloque en el caso contrario.
    } else {
      // Esta línea sirve para avisar que la respuesta no es válida.
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      // Esta línea sirve para llamar a «rl.close».
      rl.close();
    }
  }
);
