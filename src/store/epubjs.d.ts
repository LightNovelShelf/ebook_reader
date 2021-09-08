import { Book as Book85, Rendition as Rendition85, EpubCFI as EpubCFI85 } from 'epubjs85'
import { Book as BookLast, Rendition as RenditionLast, EpubCFI as EpubCFILast } from 'epubjs'

export declare type Book = BookLast | Book85
export declare type Rendition = RenditionLast | Rendition85
export declare type EpubCFI = EpubCFILast | EpubCFI85

import { RenditionOptions as RenditionOptionsLast } from 'epubjs/types/rendition'
import { RenditionOptions as RenditionOptions85 } from 'epubjs85/types/rendition'
export declare type RenditionOptions = RenditionOptionsLast | RenditionOptions85
