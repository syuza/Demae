import React, { useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Typography, Tooltip, IconButton, ListItemAvatar, Avatar, Button } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ImageIcon from '@material-ui/icons/Image';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DataLoading from 'components/DataLoading';
import { useDataSourceListen, useDocumentListen, Where } from 'hooks/firestore';
import { Provider, Product, SKU } from 'models/commerce';
import { CartContext, useCart, useUser } from 'hooks/commerce'
import Cart from 'models/commerce/Cart';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			width: '100%'
		},
		avater: {
			width: theme.spacing(16),
			height: theme.spacing(16),
		}
	}),
);

export default ({ providerID, productID }: { providerID: string, productID: string }) => {

	const classes = useStyles()
	const ref = new Provider(providerID)
		.products.doc(productID, Product)
		.skus
		.collectionReference

	const [skus, isLoading] = useDataSourceListen<SKU>(SKU, { path: ref.path, wheres: [Where('isAvailable', '==', true)], limit: 100 })
	const [product] = useDocumentListen<Product>(Product, new Provider(providerID).products.collectionReference.doc(productID))

	if (isLoading) {
		return (
			<Paper className={classes.paper} >
				<DataLoading />
			</Paper>
		)
	}

	return (
		<Paper className={classes.paper} >
			<List>
				{skus.map(doc => {
					return (
						<SKUListItem product={product} sku={doc} />
					)
				})}
			</List>
		</Paper>
	)
}

const SKUListItem = ({ product, sku }: { product?: Product, sku: SKU }) => {
	const classes = useStyles()
	const [user] = useUser()
	const [cart] = useCart()
	const imageURL = (sku.imageURLs().length > 0) ? sku.imageURLs()[0] : undefined
	const addSKU = async (sku: SKU) => {
		if (!product) return
		if (user) {
			if (cart) {
				cart.addSKU(product, sku)
				await cart.save()
			} else {
				const cart = new Cart(user.id)
				cart.addSKU(product, sku)
				await cart.save()
			}
		}
	}

	const deleteSKU = async (sku: SKU) => {
		if (!cart) { return }
		cart.deleteSKU(sku)
		await cart.save()
	}

	return (
		<ListItem key={sku.id} >
			<ListItemAvatar>
				<Avatar className={classes.avater} variant="rounded" src={imageURL}>
					<ImageIcon />
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={
					<>
						<Box mx={2} my={0} >
							<Typography variant="h6">{sku.name}</Typography>
							<Typography>{sku.displayPrice()}</Typography>
							<Typography variant="body2" color="textSecondary" component="p">{sku.caption}</Typography>
						</Box>
					</>
				}
				secondary={
					<>
						{/* <Box fontWeight="fontWeightMedium" fontSize="subtitle1" mx={2} my={0} >
								{`${ISO4217[product.currency]['symbol']}${item.subtotal().toLocaleString()}`}
							</Box> */}
					</>
				} />
			<ListItemSecondaryAction>
				<Tooltip title='Delete' onClick={() => {
					deleteSKU(sku)
					// const value = Number(qty.value) - 1
					// qty.setValue(`${Math.max(0, value)}`)
				}}>
					<IconButton>
						<RemoveCircleIcon color='inherit' />
					</IconButton>
				</Tooltip>
				{/* <Input variant='outlined' margin='dense' size='small' {...qty} style={{ width: '60px' }} /> */}
				<Tooltip title='Add' onClick={() => {
					addSKU(sku)
					// const value = Number(qty.value) + 1
					// qty.setValue(`${value}`)
				}}>
					<IconButton>
						<AddCircleIcon color='inherit' />
					</IconButton>
				</Tooltip>
				{/* <Button variant="contained" color="primary" onClick={() => {
						cart
					}}>Add to Bag</Button> */}
			</ListItemSecondaryAction>
		</ListItem>
	)
}
