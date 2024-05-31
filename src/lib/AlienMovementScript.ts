import { v4 } from "uuid";
import { LogicScript, LogicScriptData } from "./interfaces/LogicScript";
import { EngineState } from "./interfaces/Engine";
import { Alien } from "./Alien";

export class AlienMovementScript implements LogicScript {
  private readonly id = v4();
  private hasBeenExecuted: boolean = false;

  constructor(private readonly canBeDestroyed: boolean) {}

  execute(engineState: EngineState): void {
    !this.hasBeenExecuted && (this.hasBeenExecuted = true);
    const { collisionSystem, stores, gameObjects, requestStoresEdit, requestGameStop } =
      engineState;

    for (const [, gameObject] of Object.entries(gameObjects)) {
      if (!(gameObject instanceof Alien)) continue;

      const motion = stores["motion"] ?? gameObject.getData().motion;
      const horizontalBoundsCollision = collisionSystem.checkIfIsOutOfBounds(
        gameObject,
        "horizontal"
      );
      const verticalBoundsCollision = collisionSystem.checkIfIsOutOfBounds(gameObject, "vertical");

      if (horizontalBoundsCollision != null) {
        requestStoresEdit("motion", -motion);
      }

      if (verticalBoundsCollision == "bottom") {
        return requestGameStop();
      }
    }
  }

  getScriptData(): LogicScriptData {
    return {
      id: this.id,
      canBeDestroyed: this.canBeDestroyed,
      hasBeenExecuted: this.hasBeenExecuted,
    };
  }
}
