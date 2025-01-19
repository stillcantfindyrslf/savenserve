import React, {useState} from 'react'
import { Card, CardFooter, Button, Image } from '@nextui-org/react'
import {CardBody} from "@nextui-org/card";
import {Item, useItemsStore} from "@/store/useItemStore/useItemStore";


interface ItemCardProps {
	item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
	return (
			<Card
				className="max-w-xs p-3"
				shadow="none"
				key={item.id}
			>
				<CardBody>
					<Image
						src={item.image || '/placeholder-image.jpg'}
						alt={item.name}
						width="100%"
						height={200}
						objectFit="cover"
					/>
					<div className="flex flex-col items-center mt-4 text-center">
						<p className="text-2xl font-bold text-primary-color">
							{item.price} р.
						</p>
						<h3 className="font-semibold text-md leading-4 line-clamp-2">{item.name}</h3>
						<p className="text-sm leading-4 line-clamp-2 mt-2">{item.description}</p>
					</div>
				</CardBody>
				<CardFooter>
						<Button fullWidth={true} className="bg-light-secondary-color">Добавить в корзину</Button>
				</CardFooter>
			</Card>
	);
}

export default ItemCard