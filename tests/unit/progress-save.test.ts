import assert from "node:assert/strict";
import test from "node:test";
import { runProgressSave } from "@/components/progreso/progress-save";

test("a successful persistence reports success once without an error",async()=>{let requests=0,success=0,failures=0,resets=0,refreshes=0;const result=await runProgressSave({request:async()=>{requests++;return new Response(JSON.stringify({record:{Registro_ID:"test"}}),{status:201})},reset:()=>{resets++},success:()=>{success++},failure:()=>{failures++},refresh:()=>{refreshes++}});assert.equal(result,true);assert.equal(requests,1);assert.equal(success,1);assert.equal(failures,0);assert.equal(resets,1);assert.equal(refreshes,1);});
