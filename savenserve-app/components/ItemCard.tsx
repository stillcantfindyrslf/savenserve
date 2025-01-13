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
				className="max-w-[300px] p-3"
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
					<p>{item.name}</p>
					 <p>{item.description}</p>
					<p>${item.price}</p>
				</CardBody>
				<CardFooter>
						<Button fullWidth={true} className="bg-light-secondary-color">Добавить в корзину</Button>
				</CardFooter>
			</Card>
	);
}

export default ItemCard