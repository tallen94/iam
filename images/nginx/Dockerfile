FROM nginx

COPY nginx.conf.template /etc/nginx/nginx.conf.template

ARG host
ARG port
ENV IAM_KUBE_HOST=$host
ENV IAM_KUBE_PORT=$port

EXPOSE 80
RUN envsubst '\$IAM_KUBE_HOST \$IAM_KUBE_PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf
