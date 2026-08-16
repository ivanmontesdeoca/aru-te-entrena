import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("template and routine editors reuse the same exercise combobox",async()=>{const files=await Promise.all(["src/components/admin/plantilla-editor.tsx","src/components/admin/rutina-editor.tsx"].map(path=>readFile(path,"utf8")));for(const source of files){assert.match(source,/ExerciseSearchCombobox/);assert.doesNotMatch(source,/resultados visibles|choices\.map|options\.map/);}});
