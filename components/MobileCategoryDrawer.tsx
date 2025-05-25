import React, { FC } from "react";
import { Drawer, DrawerContent, DrawerBody } from "@nextui-org/react";
import { IoCloseOutline } from "react-icons/io5";
import SidebarCategory from "./SidebarCategory";
import { Category } from "@/store/useCategoriesStore/types";

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategoryUrlName?: string;
  onSelectFavorites?: () => void;
}

const MobileCategoryDrawer: FC<MobileCategoryDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  activeCategoryUrlName,
  onSelectFavorites,
}) => {

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="left"
      closeButton={<div><IoCloseOutline className="h-8 w-8" onClick={onClose} /></div>}
      classNames={{
        body: "p-0",
      }}
    >
      <DrawerContent>
        <DrawerBody className="p-4">
          <SidebarCategory
            categories={categories}
            activeCategoryUrlName={activeCategoryUrlName}
            onSelectFavorites={onSelectFavorites}
            onCategoryClick={onClose}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileCategoryDrawer;