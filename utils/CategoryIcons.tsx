import { LuMilk, LuWheat } from "react-icons/lu";
import { TbBottle, TbCoffee, TbMeat, TbChefHat, TbCandy, TbBrandPeanut } from "react-icons/tb";
import { CiBowlNoodles } from "react-icons/ci";
import { GiOpenedFoodCan } from "react-icons/gi";
import { JSX } from "react";

export interface CategoryIcon {
  name: string;
  component: JSX.Element;
  label: string;
}

export const categoryIcons: CategoryIcon[] = [
  { name: "wheat", component: <LuWheat key="wheat" />, label: "Пшеница/Зерновые" },
  { name: "chef", component: <TbChefHat key="cook" />, label: "Кулинария" },
  { name: "meat", component: <TbMeat key="meat" />, label: "Мясо" },
  { name: "coffee", component: <TbCoffee key="coffee" />, label: "Кофе/Чай" },
  { name: "candy", component: <TbCandy key="candy" />, label: "Сладости" },
  { name: "milk", component: <LuMilk key="milk" />, label: "Молочные продукты" },
  { name: "bottle", component: <TbBottle key="bottle" />, label: "Напитки" },
  { name: "pasta", component: <CiBowlNoodles key="pasta" />, label: "Макароны" },
  { name: "can", component: <GiOpenedFoodCan key="food-can" />, label: "Консервы" },
  { name: "nuts", component: <TbBrandPeanut key="peanut" />, label: "Орехи" }
];

export const getIconByName = (iconName: string | null): JSX.Element | null => {
  if (!iconName) return null;
  const icon = categoryIcons.find(icon => icon.name === iconName);
  return icon ? icon.component : null;
};

export const getIconNames = (): { name: string; label: string }[] => {
  return categoryIcons.map(icon => ({ name: icon.name, label: icon.label }));
};