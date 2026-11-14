import React from 'react';

export const Card = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className = '',
  bodyClassName = 'p-5',
  headerClassName = 'px-5 py-4 border-b border-surface-border',
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-surface-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Top Subtle Specular Edge */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent pointer-events-none" />

      {/* Card Header */}
      {(title || subtitle || action || badge) && (
        <div className={`flex items-center justify-between gap-4 ${headerClassName}`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              {title && (
                <h3 className="text-sm font-semibold text-main tracking-tight truncate">
                  {title}
                </h3>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-secondary mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={noPadding ? '' : bodyClassName}>{children}</div>
    </div>
  );
};

export default Card;
