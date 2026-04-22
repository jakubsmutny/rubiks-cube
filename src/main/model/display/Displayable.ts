export type DisplayableType = 'heading' | 'text' | 'notation'

export interface Displayable {
    getContents(): string
    getType(): DisplayableType
}
