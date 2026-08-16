import assert from "node:assert/strict";
import test from "node:test";
import { completionDestination } from "@/components/alumno/completion-flow";
test("completing redirects home while reverting stays on the detail",()=>{assert.equal(completionDestination(false),"/entrenamientos");assert.equal(completionDestination(true),null);});
