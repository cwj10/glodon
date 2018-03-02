//
//  UIImage+Compress.h
//  tesn
//
//  Created by soul on 14-10-29.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (Compress)
+(NSData *)compressImage:(UIImage *)image;

+ (NSData *)originImage:(UIImage *)image;

+ (UIImage *)fixOrientation:(UIImage *)aImage;
@end
