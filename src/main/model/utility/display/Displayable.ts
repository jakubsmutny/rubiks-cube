export type DisplayableType = 'heading' | 'text' | 'notation' | 'picture'

export interface Displayable {
    getContents(): string
    getType(): DisplayableType
}
