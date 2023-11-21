import React from "react";
import { Footer } from "../../src/packages/excalidraw/index";
import { EncryptedIcon } from "./EncryptedIcon";
<<<<<<< HEAD:src/excalidraw-app/components/AppFooter.tsx
=======
import { ExcalidrawPlusAppLink } from "./ExcalidrawPlusAppLink";
import { isExcalidrawPlusSignedUser } from "../app_constants";
>>>>>>> 7c9cf30909c6c368407994cb25e22292b99eee5d:excalidraw-app/components/AppFooter.tsx

export const AppFooter = React.memo(() => {
  return (
    <Footer>
      <div
        style={{
          display: "flex",
          gap: ".5rem",
          alignItems: "center",
        }}
      >
<<<<<<< HEAD:src/excalidraw-app/components/AppFooter.tsx
=======
        {isExcalidrawPlusSignedUser ? (
          <ExcalidrawPlusAppLink />
        ) : (
          <EncryptedIcon />
        )}
>>>>>>> 7c9cf30909c6c368407994cb25e22292b99eee5d:excalidraw-app/components/AppFooter.tsx
      </div>
    </Footer>
  );
});
