export function buildProductImageUrlWithSize(
    game: string,
    productId: string,
    variant: string,
    side: 'front' | 'back',
    size: 'thumbnail' | 'medium' | 'original'
): string {
    const normalizedGame = game.toLowerCase().replace(/\s+/g, '-');
    return `https://images.tcgemporium.com/products/${normalizedGame}/${productId}/${variant}/${side}/${size}.jpg`;
}