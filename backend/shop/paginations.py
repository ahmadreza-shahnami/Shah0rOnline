from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class StorePagination(PageNumberPagination):
    page_size = 10
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'message': 'stores retrieved successfully',
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'data': data
        })