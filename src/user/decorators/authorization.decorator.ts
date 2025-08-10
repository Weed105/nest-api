import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserGuard } from "../guards/user.guard";
import { RolesGuard } from "../guards/role.guard";

export function Authorization(){
    return applyDecorators(UseGuards(UserGuard, RolesGuard));
}